module.exports = (renderWithSidebarFooter) => {
    const express = require("express");
    const fs = require("fs");
    const path = require("path");
    const mysql = require("mysql2/promise");
  
    const router = express.Router();
  
    // Database connection pool
    const pool = mysql.createPool({
      host: process.env.DB_HOST || "db",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "vulnerable_password",
      database: process.env.DB_NAME || "vulnerable_app",
      waitForConnections: true,
      connectionLimit: 20,
      queueLimit: 50,
    });
  
    router.get("/", async (req, res) => {
      const productName = req.query.product_name || "";
      let result = "";
  
      let html = fs.readFileSync(path.join(__dirname, "view.html"), "utf8");
  
      if (productName) {
        let tableHtml = `
        <h3>Search Results</h3>
        <table>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
          </tr>
        `;
        try {
            const connection = await pool.getConnection();

            // VULNERABLE: Direct string concatenation - allows SQL injection
            const query = `SELECT id, name, description, price FROM products WHERE name LIKE '%${productName}%'`;

            console.log("Executing Query:", query);
            
            const [rows] = await connection.execute(query);
            connection.release();

            if (rows.length > 0) {


              rows.forEach((row) => {
                tableHtml += `
                  <tr>
                    <td>${escapeHtml(row.id)}</td>
                    <td>${escapeHtml(row.name)}</td>
                    <td>${escapeHtml(row.description)}</td>
                    <td>${escapeHtml(row.price)}</td>
                  </tr>
                `;
              });

            } else {
              tableHtml += `<tr><td>No products found matching: "${escapeHtml(productName)}"</td></tr>`;
            }
            tableHtml += `</table>`;
            result = tableHtml;
        } catch (error) {
            tableHtml += `<tr><td>Error executing query: ${escapeHtml(error.message)}</td></tr>`;
            tableHtml += `</table>`;
            result = tableHtml;
            console.error("SQL Injection Test - Error:", error.message);
        }
      }
  
      html = html.replace("{{product_name}}", escapeHtml(productName));
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