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
  const grid = lab.querySelector("[class*=grid]");
  const cards = grid ? [...grid.children] : [];

  function tops(selectorTexts) {
    return selectorTexts.map((text) => {
      const els = [...lab.querySelectorAll("p")].filter(
        (p) => p.textContent.trim() === text
      );
      return els.map((el) => {
        const b = el.getBoundingClientRect();
        const card = cards.findIndex((c) => c.contains(el));
        return {
          text,
          card,
          top: Math.round(b.top),
          fontSize: getComputedStyle(el).fontSize,
          transform: getComputedStyle(el).textTransform,
        };
      });
    }).flat();
  }

  function mediaBox(labelText, cardIdx) {
    const card = cards[cardIdx];
    const p = [...card.querySelectorAll("p")].find(
      (el) => el.textContent.trim() === labelText
    );
    const box = p?.nextElementSibling;
    if (!box) return null;
    const b = box.getBoundingClientRect();
    const cardR = card.getBoundingClientRect();
    return {
      label: labelText,
      top: Math.round(b.top),
      h: Math.round(b.height),
      w: Math.round(b.width),
      distRight: Math.round(cardR.right - b.right),
    };
  }

  return {
    labels: tops([
      "Immagine di esempio",
      "Anello del diaframma",
      "Tempo di posa",
      "Valore di apertura: numero F",
      "Valore del tempo di posa in secondi",
    ]),
    media: [
      mediaBox("Immagine di esempio", 0),
      mediaBox("Anello del diaframma", 0),
      mediaBox("Immagine di esempio", 1),
      mediaBox("Tempo di posa", 1),
    ],
    cards: cards.map((c, i) => {
      const b = c.getBoundingClientRect();
      return {
        i,
        bottom: Math.round(b.bottom),
        h: Math.round(b.height),
      };
    }),
  };
});

const labelTops = r.labels
  .filter((l) =>
    ["Immagine di esempio", "Anello del diaframma", "Tempo di posa"].includes(
      l.text
    )
  )
  .map((l) => l.top);
const mediaTops = r.media.map((m) => m?.top).filter((t) => t != null);
const valueTops = r.labels
  .filter((l) => l.text.startsWith("Valore"))
  .map((l) => l.top);

const ok = {
  labelsSameTop: Math.max(...labelTops) - Math.min(...labelTops) <= 2,
  mediaSameTop: Math.max(...mediaTops) - Math.min(...mediaTops) <= 2,
  mediaSameH: r.media.every((m) => m && m.h === r.media[0].h),
  valuesSameTop: Math.max(...valueTops) - Math.min(...valueTops) <= 2,
  cardsSameBottom:
    Math.abs(r.cards[0].bottom - r.cards[1].bottom) <= 2,
  lensesNearRight: r.media
    .filter((m) => m && /Anello|Tempo di posa/.test(m.label))
    .every((m) => m.distRight <= 24),
};

console.log(JSON.stringify({ ok, ...r }, null, 2));
await browser.close();
if (!Object.values(ok).every(Boolean)) process.exit(1);
