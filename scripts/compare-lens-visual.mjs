import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const OUT = path.join("scripts", "tmp-lens-compare");
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
await page.addInitScript(() => {
  try {
    sessionStorage.setItem("antoniomanno_intro_seen", "1");
  } catch {}
});
await page.goto("http://localhost:3000/#laboratorio", {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});
await page.waitForTimeout(2500);
await page.locator("#laboratorio").scrollIntoViewIfNeeded();
await page.evaluate(() =>
  document.getElementById("iubenda-cs-banner")?.remove()
);
await page.waitForTimeout(1000);

const meta = await page.evaluate(() => {
  const lab = document.getElementById("laboratorio");
  function afterLabel(labelText) {
    const p = [...lab.querySelectorAll("p")].find(
      (el) => el.textContent.trim() === labelText
    );
    return p?.parentElement?.querySelector("div") || null;
  }
  const leftBox = afterLabel("Anello del diaframma");
  const rightBox = afterLabel("Tempo di posa");
  const ring = [...lab.querySelectorAll("img")].find(
    (i) =>
      (i.alt || "").includes("aperture ring") &&
      getComputedStyle(i).display !== "none"
  );
  const canvas = [...lab.querySelectorAll("canvas")].find(
    (c) => getComputedStyle(c).display !== "none"
  );
  function rect(el) {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  }
  return {
    leftBox: rect(leftBox),
    rightBox: rect(rightBox),
    ring: rect(ring),
    canvas: rect(canvas),
  };
});

async function opaqueBounds(clip) {
  await page.screenshot({
    path: path.join(OUT, "tmp.png"),
    clip: {
      x: clip.x,
      y: clip.y,
      width: clip.w,
      height: clip.h,
    },
  });
  // Analisi pixel via canvas in page
  const buf = fs.readFileSync(path.join(OUT, "tmp.png"));
  const b64 = buf.toString("base64");
  return page.evaluate(async (b64data) => {
    const img = new Image();
    img.src = "data:image/png;base64," + b64data;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.width;
    c.height = img.height;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);
    const { data, width, height } = ctx.getImageData(0, 0, c.width, c.height);
    let minX = width,
      minY = height,
      maxX = 0,
      maxY = 0,
      count = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const a = data[i + 3];
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // non-nero e non trasparente: grafica lente
        const lum = (r + g + b) / 3;
        if (a > 20 && lum > 18) {
          count++;
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
    }
    if (count === 0) return { count: 0 };
    return {
      count,
      minX,
      minY,
      maxX,
      maxY,
      contentW: maxX - minX + 1,
      contentH: maxY - minY + 1,
      imgW: width,
      imgH: height,
    };
  }, b64);
}

const leftContent = await opaqueBounds(meta.ring);
fs.renameSync(path.join(OUT, "tmp.png"), path.join(OUT, "left-ring.png"));
const rightContent = await opaqueBounds(meta.canvas);
fs.renameSync(path.join(OUT, "tmp.png"), path.join(OUT, "right-canvas.png"));

const report = {
  meta,
  leftContent,
  rightContent,
  deltaW: (leftContent.contentW || 0) - (rightContent.contentW || 0),
  deltaH: (leftContent.contentH || 0) - (rightContent.contentH || 0),
};
fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
await browser.close();
