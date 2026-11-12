module.exports = (renderWithSidebarFooter) => {
  const express = require("express");
  const fs = require("fs");
  const path = require("path");
  const mysql = require("mysql2/promise");
  const sanitizeHtml = require('sanitize-html');

  const router = express.Router();
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
    try {
      const [comments] = await pool.query(
        "SELECT id, content FROM comments ORDER BY id ASC"
      );

      const commentsHtml = comments.map((comment) => `
        <article class="comment">
          <div class="comment-content">${comment.content}</div>
          <form method="POST" action="/stored-xss/delete">
            <input type="hidden" name="id" value="${comment.id}">
            <button type="submit">Delete</button>
          </form>
        </article>
      `).join("");

      let html = fs.readFileSync(path.join(__dirname, "view.html"), "utf8");
      html = renderWithSidebarFooter(html);

      // Deliberately render stored HTML without escaping.
      html = html.replace("{{comments}}", () => commentsHtml);
      res.send(html);
    } catch (error) {
      console.error("Failed to load comments:", error);
      res.status(500).send("Failed to load comments.");
    }
  });

  router.post("/", async (req, res) => {
    if (typeof req.body.content !== "string") {
      return res.status(400).send("Comment content is required.");
    }

    const content = sanitizeHtml(req.body.content, {
      allowedTags: [
      'p', 'br', 'strong', 'em', 'u', 's',
      'h1', 'h2', 'h3', 'pre', 'code',
      'ul', 'ol', 'li', 'a', 'img', 'span'
    ],
      allowedAttributes: {}
    }).trim();

    if (!content) {
      return res.status(400).send("Comment content is required.");
    }

    try {
      await pool.execute("INSERT INTO comments (content) VALUES (?)", [content]);
      res.redirect("/stored-xss");
    } catch (error) {
      console.error("Failed to save comment:", error);
      res.status(500).send("Failed to save comment.");
    }
  });

  router.post("/delete", async (req, res) => {
    const id = req.body.id;

    if (typeof id !== "string" || !/^[1-9]\d*$/.test(id)) {
      return res.status(400).send("Invalid comment ID.");
    }

    try {
      await pool.execute("DELETE FROM comments WHERE id = ?", [id]);
      res.redirect("/stored-xss");
    } catch (error) {
      console.error("Failed to delete comment:", error);
      res.status(500).send("Failed to delete comment.");
    }
  });

  return router;
};