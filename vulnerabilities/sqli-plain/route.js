module.exports = (renderWithSidebarFooter) => {
    const express = require("express");
    const fs = require("fs");
    const path = require("path");
    const mysql = require("mysql2/promise");
  
    const router = express.Router();
  
    // Database connection pool
    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 20,
      queueLimit: 50,
    });
  
    router.get("/", async (req, res) => {
      let html = fs.readFileSync(path.join(__dirname, "view.html"), "utf8");
      html = html.replace("{{query}}", "");
      html = html.replace("{{result}}", "");
      html = renderWithSidebarFooter(html);
      res.send(html);
    });

    router.post("/", async (req, res) => {
      const query = req.body.query || "";
      let result = "";
      let queryExecuted = false;
  
      let html = fs.readFileSync(path.join(__dirname, "view.html"), "utf8");
  
      if (query) {
        let resultHtml = `<div class="query-section">`;
        try {
            const connection = await pool.getConnection();

            // No validation, no parameterization - complete arbitrary SQL execution
            console.log("Executing Query:", query);
            
            const [rows, fields] = await connection.query(query);
            connection.release();
            queryExecuted = true;

            if (rows && rows.length > 0) {
              resultHtml += `<h3>Query Results (${rows.length} rows)</h3>`;
              resultHtml += `<table class="results-table">`;
              
              // Generate table headers from fields
              if (fields && fields.length > 0) {
                resultHtml += `<tr>`;
                fields.forEach((field) => {
                  resultHtml += `<th>${escapeHtml(field.name)}</th>`;
                });
                resultHtml += `</tr>`;
              }
              
              // Generate table rows
              rows.forEach((row) => {
                resultHtml += `<tr>`;
                Object.values(row).forEach((value) => {
                  resultHtml += `<td>${escapeHtml(String(value))}</td>`;
                });
                resultHtml += `</tr>`;
              });

              resultHtml += `</table>`;
            } else {
              resultHtml += `<p><strong>Query executed successfully.</strong> ${rows && rows.length === 0 ? "No rows returned." : "Command completed."}</p>`;
            }
            
        } catch (error) {
            resultHtml += `<table class="error-table"><tr><th>SQL Error</th></tr>`;
            resultHtml += `<tr><td>${escapeHtml(error.message)}</td></tr>`;
            resultHtml += `</table>`;
            console.error("SQL Error:", error.message);
        }
        resultHtml += `</div>`;
        result = resultHtml;
      }
  
      html = html.replace("{{query}}", escapeHtml(query));
      html = html.replace("{{result}}", result);
      html = renderWithSidebarFooter(html);
  
      res.send(html);
    });
  
    return router;
  };
  
  // Helper function to escape HTML
  function escapeHtml(text) {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return String(text).replace(/[&<>"']/g, (m) => map[m]);
  }