import { chromium } from "playwright";

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
await page.waitForTimeout(2000);
await page.locator("#laboratorio").scrollIntoViewIfNeeded();
await page.evaluate(() =>
  document.getElementById("iubenda-cs-banner")?.remove()
);
await page.waitForTimeout(800);

const r = await page.evaluate(() => {
  const lab = document.getElementById("laboratorio");
  const labels = [...lab.querySelectorAll("p")].filter((p) =>
    /Anello del diaframma|Tempo di posa/i.test(p.textContent || "")
  );
  // colonna media: contenitore quadrato sotto le label
  function boxAfterLabel(labelText) {
    const p = [...lab.querySelectorAll("p")].find(
      (el) => el.textContent.trim() === labelText
    );
    const col = p?.parentElement;
    const box = col?.querySelector("div");
    if (!box) return null;
    const r = box.getBoundingClientRect();
    return {
      label: labelText,
      w: Math.round(r.width * 10) / 10,
      h: Math.round(r.height * 10) / 10,
    };
  }
  const left = boxAfterLabel("Anello del diaframma");
  const right = boxAfterLabel("Tempo di posa");
  // canvas visibile dx
  const canvas = [...lab.querySelectorAll("canvas")].find(
    (c) => getComputedStyle(c).display !== "none"
  );
  const cr = canvas?.getBoundingClientRect();
  // img anello visibile sx
  const ring = [...lab.querySelectorAll("img")].find(
    (i) =>
      (i.alt || "").includes("aperture ring") &&
      getComputedStyle(i).display !== "none"
  );
  const rr = ring?.getBoundingClientRect();
  return {
    leftBox: left,
    rightBox: right,
    ringImg: rr
      ? { w: Math.round(rr.width * 10) / 10, h: Math.round(rr.height * 10) / 10 }
      : null,
    canvas: cr
      ? { w: Math.round(cr.width * 10) / 10, h: Math.round(cr.height * 10) / 10 }
      : null,
  };
});
console.log(JSON.stringify(r, null, 2));
await browser.close();
