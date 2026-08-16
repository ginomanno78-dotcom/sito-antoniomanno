import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1400, height: 1200 } });
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
await page.waitForTimeout(800);

const r = await page.evaluate(() => {
  const lab = document.getElementById("laboratorio");
  function yOf(text) {
    const el = [...lab.querySelectorAll("p, h3, label, input")].find(
      (e) => (e.textContent || "").trim() === text
    );
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return { text, top: Math.round(b.top), bottom: Math.round(b.bottom), h: Math.round(b.height), fontSize: getComputedStyle(el).fontSize };
  }
  function box(label) {
    const p = [...lab.querySelectorAll("p")].find((e) => e.textContent.trim() === label);
    const d = p?.parentElement?.querySelector("div");
    const b = d?.getBoundingClientRect();
    return b
      ? { label, top: Math.round(b.top), left: Math.round(b.left), right: Math.round(b.right), w: Math.round(b.width), h: Math.round(b.height) }
      : null;
  }
  const cards = [...lab.querySelectorAll("[class*=box], [class*=grid] > div")];
  // take direct children of grid
  const grid = lab.querySelector("[class*=grid]");
  const cardEls = grid ? [...grid.children] : [];
  return {
    labels: [
      yOf("Immagine di esempio"),
      ...[...lab.querySelectorAll("p")].filter(p => p.textContent.trim() === "Immagine di esempio").map(p => {
        const b = p.getBoundingClientRect();
        return { text: "Immagine di esempio", top: Math.round(b.top), fontSize: getComputedStyle(p).fontSize, x: Math.round(b.left) };
      }),
      yOf("Anello del diaframma"),
      yOf("Tempo di posa"),
      yOf("Valore di apertura: numero F"),
      yOf("Valore del tempo di posa in secondi"),
    ],
    media: [
      box("Immagine di esempio"),
      box("Anello del diaframma"),
      box("Tempo di posa"),
    ],
    cards: cardEls.map((c, i) => {
      const b = c.getBoundingClientRect();
      return { i, top: Math.round(b.top), bottom: Math.round(b.bottom), h: Math.round(b.height) };
    }),
  };
});
console.log(JSON.stringify(r, null, 2));
await browser.close();
