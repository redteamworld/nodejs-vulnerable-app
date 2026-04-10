module.exports = (renderWithSidebarFooter) => {
  const express = require("express");
  const fs = require("fs");
  const path = require("path");
  const { exec } = require("child_process");

  const router = express.Router();

  router.get("/", (req, res) => {
    let html = fs.readFileSync(path.join(__dirname, "view.html"), "utf8");
    // add sidebar footer
    html = renderWithSidebarFooter(html);

    res.send(html);
  });

  router.post("/ping", (req, res) => {
    const target = req.body.target || "";
    // intentionally vulnerable
    const command = "ping -c 4 " + target;
    console.log("Executing:", command);
    exec(command, (error, stdout, stderr) => {

      if (error) {
          return res.json({
              output: error.toString()
          });
      }

      res.json({
          output: stdout
      });

    });

  });

  return router;
};