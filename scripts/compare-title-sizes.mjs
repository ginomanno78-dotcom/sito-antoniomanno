import { chromium } from "playwright";

async function measure(width) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width, height: 1100 } });
  await page.addInitScript(() => {
    try {
      sessionStorage.setItem("antoniomanno_intro_seen", "1");
    } catch {}
  });
  await page.goto("http://localhost:3000/", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.waitForTimeout(1800);
  await page.evaluate(() =>
    document.getElementById("iubenda-cs-banner")?.remove()
  );

  const r = await page.evaluate(() => {
    function info(el) {
      if (!el) return null;
      const cs = getComputedStyle(el);
      return {
        text: el.textContent.trim(),
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
      };
    }
    const bioH3 = [...document.querySelectorAll("#biografia h3")].find((h) =>
      /Il Dovere della Memoria/i.test(h.textContent || "")
    );
    const labH3 = [...document.querySelectorAll("#laboratorio h3")];
    return {
      bio: info(bioH3),
      lab: labH3.map(info),
    };
  });
  await browser.close();
  return r;
}

for (const w of [390, 800, 1280, 1400]) {
  const r = await measure(w);
  const same = r.lab.every(
    (t) =>
      t &&
      r.bio &&
      t.fontSize === r.bio.fontSize &&
      t.fontWeight === r.bio.fontWeight
  );
  console.log(
    JSON.stringify({ width: w, same, bio: r.bio, lab: r.lab }, null, 2)
  );
}
