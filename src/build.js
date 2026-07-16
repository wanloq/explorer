// Simple static-site assembler: replaces <!--@include file.html--> markers
// in src/index.template.html with the contents of src/partials/file.html,
// then writes the result to dist/index.html. Also copies JS assets.

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const PARTIALS_DIR = path.join(__dirname, "partials");
const TEMPLATE = path.join(__dirname, "index.template.html");
const DIST = path.join(ROOT, "dist");
const PUBLIC_DIR = path.join(ROOT, "public");

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(srcPath, destPath);
    else fs.copyFileSync(srcPath, destPath);
  }
}

function includePartials(html) {
  const includeRe = /<!--@include\s+([\w.-]+)\s*-->/g;
  return html.replace(includeRe, (match, filename) => {
    const partialPath = path.join(PARTIALS_DIR, filename);
    if (!fs.existsSync(partialPath)) {
      console.warn(`⚠ Partial not found: ${filename}`);
      return "";
    }
    return fs.readFileSync(partialPath, "utf8");
  });
}

function build() {
  if (!fs.existsSync(DIST)) fs.mkdirSync(DIST, { recursive: true });
  if (!fs.existsSync(path.join(DIST, "js"))) fs.mkdirSync(path.join(DIST, "js"), { recursive: true });
  if (!fs.existsSync(path.join(DIST, "css"))) fs.mkdirSync(path.join(DIST, "css"), { recursive: true });

  const template = fs.readFileSync(TEMPLATE, "utf8");
  const finalHtml = includePartials(template);
  fs.writeFileSync(path.join(DIST, "index.html"), finalHtml, "utf8");
  console.log("✔ dist/index.html assembled from partials");

  fs.copyFileSync(path.join(__dirname, "js", "main.js"), path.join(DIST, "js", "main.js"));
  console.log("✔ dist/js/main.js copied");

  copyDir(PUBLIC_DIR, DIST);
  console.log("✔ public/ assets (robots.txt, sitemap.xml, images, manifest) copied to dist/");
}

build();
