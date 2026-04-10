const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

// Serve static files for each vulnerability (CSS, etc.)
//app.use("/xss", express.static("vulnerabilities/xss"));
//app.use("/command-injection", express.static("vulnerabilities/command-injection"));

// Home route
app.get("/", (req, res) => {
  let html = fs.readFileSync(path.join(__dirname, "public/index.html"), "utf8");
  html = renderWithSidebarFooter(html);
  res.send(html);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


// Sidebar HELPER
function renderWithSidebarFooter(html) {
  const sidebar = fs.readFileSync(path.join(__dirname, "public/sidebar.html"), "utf8");
  const footer = fs.readFileSync(path.join(__dirname, "public/footer.html"), "utf8");
  html = html.replace("{{sidebar}}", sidebar);
  html = html.replace("{{footer}}", footer);
  return html
}

// Load vulnerabilities dynamically
const vulnPath = path.join(__dirname, "vulnerabilities");

fs.readdirSync(vulnPath).forEach((folder) => {
  const routeFile = path.join(vulnPath, folder, "route.js");

  if (fs.existsSync(routeFile)) {
    const route = require(routeFile)(renderWithSidebarFooter); // pass helper
    app.use(`/${folder}`, route);
  }
});


app.listen(3000, () => {
  console.log("Running on http://localhost:3000");
});