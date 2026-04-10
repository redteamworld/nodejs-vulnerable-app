module.exports = (renderWithSidebarFooter) => {
  const express = require("express");
  const fs = require("fs");
  const path = require("path");

  const router = express.Router();

  router.get("/", (req, res) => {
    const name = req.query.name || "";

    let html = fs.readFileSync(path.join(__dirname, "view.html"), "utf8");

    // vulnerable injection
    html = html.replace("{{output}}", name);

    // add sidebar footer
    html = renderWithSidebarFooter(html);

    res.send(html);
  });

  return router;
};