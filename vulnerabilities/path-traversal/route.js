module.exports = (renderWithSidebarFooter) => {
    const express = require("express");
    const fs = require("fs");
    const path = require("path");
  
    const router = express.Router();
    
    function escapeHtml(str) {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    router.get("/", (req, res) => {
      const file = req.query.file || "view.html";
  
      const filePath = path.join(__dirname, file);
      
      fs.readFile(filePath, 'utf8', (err, fileData) => {
        if (err) {
            fileData = 'Error reading file';
        }
        
        // Load template
        let html = fs.readFileSync(path.join(__dirname, "view.html"), "utf8");

        // add sidebar footer
        html = renderWithSidebarFooter(html);

        html = html.replace("{{filename}}", escapeHtml(file));
        html = html.replace("{{output}}", escapeHtml(fileData));
       

        res.send(html);
    });
});
 
    return router;
};