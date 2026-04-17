const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const indexPath = path.join(rootDir, "index.html");

const portfolioSources = {
  "auschwitz.html": "assets/images/photo-auschwitz/thumbs",
  "city.html": "assets/images/photo-city",
  "portraits.html": "assets/images/photo-portraits/thumbs",
  "jazz.html": "assets/images/photo-jazz/thumbs",
  "landscapes.html": "assets/images/photo-landscapes",
  "street.html": "assets/images/photo-street",
  "cardcustoms.html": "assets/images/photo-customs/thumbs",
  "windows.html": "assets/images/photo-windows"
};

const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

function countImages(relativeDir) {
  const absDir = path.join(rootDir, relativeDir);
  if (!fs.existsSync(absDir)) return 0;
  const entries = fs.readdirSync(absDir, { withFileTypes: true });
  return entries.filter((entry) => {
    if (!entry.isFile()) return false;
    const ext = path.extname(entry.name).toLowerCase();
    return allowedExtensions.has(ext);
  }).length;
}

function updateAnchorCount(html, href, count) {
  const anchorRegex = new RegExp(
    `(<a\\s+href="${href}"[\\s\\S]*?<span\\s+class="portfolio-item-count">)([^<]*)(<\\/span>)`,
    "g"
  );
  return html.replace(anchorRegex, `$1${count} photo$3`);
}

function updatePortfolioCounts() {
  let indexHtml = fs.readFileSync(indexPath, "utf8");

  for (const [href, sourceDir] of Object.entries(portfolioSources)) {
    const count = countImages(sourceDir);
    indexHtml = updateAnchorCount(indexHtml, href, count);
  }

  fs.writeFileSync(indexPath, indexHtml, "utf8");
  process.stdout.write("Conteggi portfolio aggiornati in index.html\n");
}

module.exports = {
  updatePortfolioCounts
};

if (require.main === module) {
  updatePortfolioCounts();
}
