module.exports = (renderWithSidebarFooter) => {
  const express = require("express");
  const ejs = require("ejs");
  const pug = require("pug");
  const fs = require("fs");
  const path = require("path");

  const router = express.Router();

  router.get("/", (req, res) => {
    let html = fs.readFileSync(path.join(__dirname, "view.html"), "utf8");
    html = renderWithSidebarFooter(html);
    res.send(html);
  });

  router.post("/preview", (req, res) => {
    const { engine, template, recipient } = req.body || {};

    if (
      typeof engine !== "string" ||
      typeof template !== "string" ||
      typeof recipient !== "string"
    ) {
      return res.status(400).json({
        error: "Engine, template, and recipient must be strings."
      });
    }

    if (!["ejs", "pug"].includes(engine)) {
      return res.status(400).json({ error: "Unknown template engine." });
    }

    try {
      // Intentionally vulnerable: user input is compiled as template source.
      const html = engine === "ejs"
        ? ejs.render(template, { recipient })
        : pug.render(template, { recipient });

      return res.json({ html });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  });

  return router;
};