/**
 * Verifica Tempo di posa: immagine esempio + Lottie obiettivo visibili.
 * Richiede: npm run dev su http://localhost:3000
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASE = "http://localhost:3000";
const OUT = path.join("scripts", "tmp-verify-tempo-posa");

function canvasStats(page) {
  return page.evaluate(() => {
    const root = document.getElementById("laboratorio");
    const canvas = [...(root?.querySelectorAll("canvas") || [])].find(
      (c) => getComputedStyle(c).display !== "none"
    );
    if (!canvas) return { found: false };
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const { width: w, height: h } = canvas;
    const data = ctx.getImageData(0, 0, w, h).data;
    let opaque = 0;
    let colorful = 0;
    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3];
      if (a < 8) continue;
      opaque++;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (Math.max(r, g, b) - Math.min(r, g, b) > 25) colorful++;
    }
    return {
      found: true,
      w,
      h,
      opaque,
      colorful,
      ready: root
        ?.querySelector("[data-lottie-ready]")
        ?.getAttribute("data-lottie-ready"),
    };
  });
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  await page.addInitScript(() => {
    try {
      sessionStorage.setItem("antoniomanno_intro_seen", "1");
    } catch {}
  });

  await page.goto(BASE + "/#laboratorio", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.waitForTimeout(1200);
  await page.locator("#laboratorio").scrollIntoViewIfNeeded();
  await page.evaluate(() => document.getElementById("iubenda-cs-banner")?.remove());

  // Attendi preload Lottie
  await page.waitForFunction(
    () =>
      document
        .querySelector("#laboratorio [data-lottie-ready]")
        ?.getAttribute("data-lottie-ready") === "1",
    { timeout: 20000 }
  );
  await page.waitForTimeout(500);

  const onLoadExample = await page.evaluate(() => {
    const root = document.getElementById("laboratorio");
    const img = [...(root?.querySelectorAll("img") || [])].find(
      (i) =>
        (i.alt || "").includes("mosso") && getComputedStyle(i).display !== "none"
    );
    return {
      visible: !!img,
      naturalWidth: img?.naturalWidth ?? 0,
      checked: [...(root?.querySelectorAll('input[name="shutter-option"]') || [])]
        .find((i) => i.checked)
        ?.parentElement?.innerText?.trim(),
    };
  });

  const onLoadLottie = await canvasStats(page);
  await page.screenshot({
    path: path.join(OUT, "on-load.png"),
    fullPage: false,
  });

  // Click 0.5s e cattura a metà animazione
  await page.locator("#laboratorio label").filter({ hasText: "0.5s" }).click({
    force: true,
  });
  await page.waitForTimeout(250);
  const mid = await canvasStats(page);
  const box = await page.evaluate(() => {
    const c = [...document.querySelectorAll("#laboratorio canvas")].find(
      (el) => getComputedStyle(el).display !== "none"
    );
    const r = c.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  });
  await page.screenshot({
    path: path.join(OUT, "lottie-mid.png"),
    clip: box,
  });

  const afterExample = await page.evaluate(() => {
    const root = document.getElementById("laboratorio");
    const img = [...(root?.querySelectorAll("img") || [])].find(
      (i) =>
        (i.alt || "").includes("mosso") && getComputedStyle(i).display !== "none"
    );
    return { visible: !!img, naturalWidth: img?.naturalWidth ?? 0 };
  });

  const ok =
    onLoadExample.visible &&
    onLoadExample.naturalWidth > 0 &&
    onLoadExample.checked === "1s" &&
    onLoadLottie.found &&
    onLoadLottie.opaque > 1000 &&
    afterExample.visible &&
    afterExample.naturalWidth > 0 &&
    mid.opaque > 1000;

  const report = {
    ok,
    onLoadExample,
    onLoadLottie,
    mid,
    afterExample,
  };
  fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));

  await browser.close();
  if (!ok) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
