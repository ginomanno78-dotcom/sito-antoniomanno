const fs = require("fs");
const path = require("path");
const { updatePortfolioCounts } = require("./update-portfolio-counts");

const rootDir = path.resolve(__dirname, "..");
const imagesRoot = path.join(rootDir, "assets", "images");

let timer = null;

function scheduleUpdate() {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    try {
      updatePortfolioCounts();
    } catch (error) {
      process.stderr.write(`Errore aggiornamento conteggi: ${error.message}\n`);
    }
  }, 250);
}

updatePortfolioCounts();
process.stdout.write("Watcher conteggi portfolio attivo su assets/images\n");

fs.watch(imagesRoot, { recursive: true }, (_eventType, filename) => {
  if (!filename) return;
  scheduleUpdate();
});
