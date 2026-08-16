import { chromium } from "playwright";

async function measure(width) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width, height: 1200 } });
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
        text: (el.textContent || "").trim().slice(0, 48),
        fontSize: cs.fontSize,
        fontSizePx: parseFloat(cs.fontSize),
        lineHeight: cs.lineHeight,
      };
    }

    const bioTexts = [...document.querySelectorAll("#biografia .chapterBody p, #biografia [class*=chapterBody] p")]
      .filter((p) => (p.textContent || "").trim().length > 40)
      .map(info);

    // fallback se class name hashed: paragrafi nelle card biografia sotto h3 capitolo
    let bioFallback = bioTexts;
    if (bioFallback.length === 0) {
      const cardPs = [];
      for (const h3 of document.querySelectorAll("#biografia h3")) {
        if (!/Dal Mare|Jazz|Dovere|Fotografia Oggi/i.test(h3.textContent || "")) continue;
        let n = h3.nextElementSibling;
        while (n) {
          if (n.tagName === "H3" || n.tagName === "H4") break;
          if (n.tagName === "P" && (n.textContent || "").trim().length > 40) {
            cardPs.push(n);
          }
          n = n.nextElementSibling;
        }
        // anche parent siblings
        const body = h3.parentElement;
        if (body) {
          for (const p of body.querySelectorAll("p")) {
            if ((p.textContent || "").trim().length > 40) cardPs.push(p);
          }
        }
      }
      bioFallback = [...new Set(cardPs)].map(info);
    }

    const labLeads = [...document.querySelectorAll("#laboratorio p")]
      .filter((p) =>
        /profondità di campo|tempo di posa controlla/i.test(p.textContent || "")
      )
      .map(info);

    return { bio: bioFallback, lab: labLeads };
  });

  await browser.close();
  return r;
}

for (const w of [390, 800, 1280]) {
  const r = await measure(w);
  const bioSize = r.bio[0]?.fontSizePx ?? null;
  const labSize = r.lab[0]?.fontSizePx ?? null;
  const bioSmaller =
    bioSize != null && labSize != null ? bioSize < labSize - 0.05 : null;
  console.log(
    JSON.stringify(
      {
        width: w,
        bioSize,
        labSize,
        bioSmaller,
        bioSample: r.bio[0],
        labSample: r.lab[0],
        bioCount: r.bio.length,
        labCount: r.lab.length,
      },
      null,
      2
    )
  );
}
