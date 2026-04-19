const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const indexPath = path.join(rootDir, "index.html");

const portfolioSources = {
  "auschwitz.html": "assets/images/photo-auschwitz",
  "city.html": "assets/images/photo-city",
  "portraits.html": "assets/images/photo-portraits",
  "jazz.html": "assets/images/photo-jazz",
  "landscapes.html": "assets/images/photo-landscapes",
  "street.html": "assets/images/photo-street",
  "customs.html": "assets/images/photo-customs",
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

function getImageBaseNames(relativeDir) {
  const absDir = path.join(rootDir, relativeDir);
  if (!fs.existsSync(absDir)) return new Set();
  const entries = fs.readdirSync(absDir, { withFileTypes: true });
  const baseNames = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => allowedExtensions.has(path.extname(name).toLowerCase()))
    .map((name) => path.basename(name, path.extname(name)).toLowerCase());
  return new Set(baseNames);
}

function countImagesFromThumbsAndFull(baseRelativeDir) {
  const thumbs = getImageBaseNames(path.join(baseRelativeDir, "thumbs"));
  const full = getImageBaseNames(path.join(baseRelativeDir, "full"));
  let count = 0;
  for (const name of thumbs) {
    if (full.has(name)) count += 1;
  }
  return count;
}

function updateAnchorCount(html, href, count) {
  // Solo il testo dentro .portfolio-item-count-text (l'icona SVG resta intatta)
  const anchorRegex = new RegExp(
    `(<a\\s+href="${href}"\\s+class="[^"]*portfolio-item[^"]*"[\\s\\S]*?<span\\s+class="portfolio-item-count-text">)([^<]*)(<\\/span>)`,
    "g"
  );
  return html.replace(anchorRegex, `$1${count} photo$3`);
}

function updatePortfolioCounts() {
  let indexHtml = fs.readFileSync(indexPath, "utf8");

  for (const [href, sourceDir] of Object.entries(portfolioSources)) {
    const count = countImagesFromThumbsAndFull(sourceDir);
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
