/**
 * Test interattivo navbar: dropdown Biografia + link Laboratorio.
 * Esegui: node scripts/test-laboratorio-nav.mjs
 */
import { chromium } from "playwright";

const BASE = "http://localhost:3000";

async function assert(cond, msg) {
  if (!cond) throw new Error("FAIL: " + msg);
  console.log("OK:", msg);
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

  // Salta intro se presente
  await page.addInitScript(() => {
    try {
      sessionStorage.setItem("antoniomanno_intro_seen", "1");
    } catch {}
  });

  /* —— Home: hover apre, leave chiude —— */
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.evaluate(() => {
    document.documentElement.removeAttribute("data-intro");
    document.getElementById("iubenda-cs-banner")?.remove();
    document.querySelectorAll(".iubenda-cs-container").forEach((el) => el.remove());
  });
  await page.addStyleTag({
    content: "#iubenda-cs-banner,.iubenda-cs-container{display:none!important;pointer-events:none!important}",
  });

  const bioLi = page.locator("header li").filter({ hasText: /^biografia/i }).first();
  await assert((await bioLi.count()) === 1, "voce biografia presente in home");

  const labLink = bioLi.locator('a[href="/#laboratorio"]');
  await assert((await labLink.count()) === 1, "link Laboratorio nel dropdown");

  // Chiuso a riposo (opacity ~0 o visibility hidden)
  const closedOpacity = await labLink.evaluate((el) => {
    const menu = el.closest("ul");
    return menu ? getComputedStyle(menu).opacity : "missing";
  });
  await assert(closedOpacity === "0", "dropdown chiuso a riposo (opacity 0), got " + closedOpacity);

  await bioLi.hover();
  await page.waitForTimeout(350);
  const openOpacity = await labLink.evaluate((el) => {
    const menu = el.closest("ul");
    return menu ? getComputedStyle(menu).opacity : "missing";
  });
  await assert(openOpacity === "1", "dropdown aperto su hover biografia");

  // Larghezza compatta
  const box = await labLink.evaluate((el) => {
    const menu = el.closest("ul");
    const r = menu.getBoundingClientRect();
    return { w: r.width, text: el.textContent.trim() };
  });
  await assert(box.w < 175, `dropdown compatto width=${box.w.toFixed(1)} < 175`);
  await assert(box.w > 80, `dropdown non troppo stretto width=${box.w.toFixed(1)}`);

  // Leave: deve chiudere (niente focus-within sticky)
  await page.mouse.move(0, 0);
  await page.waitForTimeout(350);
  const afterLeave = await labLink.evaluate((el) => {
    const menu = el.closest("ul");
    return menu ? getComputedStyle(menu).opacity : "missing";
  });
  await assert(afterLeave === "0", "dropdown si chiude dopo mouse leave");

  // Click Laboratorio → sezione
  await bioLi.hover();
  await page.waitForTimeout(200);
  await labLink.click();
  await page.waitForTimeout(900);
  const afterNav = await page.evaluate(() => {
    const el = document.getElementById("laboratorio");
    if (!el) return { ok: false, reason: "no-el" };
    const r = el.getBoundingClientRect();
    return {
      ok: r.top < window.innerHeight * 0.9 && r.bottom > 0,
      top: Math.round(r.top),
      bottom: Math.round(r.bottom),
      hash: location.hash,
      scrollY: Math.round(window.scrollY),
    };
  });
  console.log("debug afterNav", afterNav);
  await assert(afterNav.ok, "dopo click Laboratorio la sezione è in viewport");

  await page.mouse.move(0, 0);
  await page.waitForTimeout(350);
  const afterClick = await labLink.evaluate((el) => {
    const menu = el.closest("ul");
    return menu ? getComputedStyle(menu).opacity : "missing";
  });
  await assert(afterClick === "0", "dropdown chiuso dopo navigazione (non resta aperto)");

  /* —— Pagine secondarie: link presente —— */
  for (const path of ["/portraits", "/mostra-jazz", "/privacy", "/processions"]) {
    await page.goto(BASE + path, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => document.getElementById("iubenda-cs-banner")?.remove());
    const n = await page.locator('a[href="/#laboratorio"]').count();
    await assert(n >= 1, `link Laboratorio su ${path}`);
  }

  /* —— Da gallery a laboratorio —— */
  await page.goto(BASE + "/portraits", { waitUntil: "networkidle" });
  await page.evaluate(() => document.getElementById("iubenda-cs-banner")?.remove());
  await page.addStyleTag({
    content: "#iubenda-cs-banner,.iubenda-cs-container{display:none!important;pointer-events:none!important}",
  });
  const bio2 = page.locator("header li").filter({ hasText: /^biografia/i }).first();
  await bio2.hover();
  await page.waitForTimeout(250);
  await bio2.locator('a[href="/#laboratorio"]').click();
  await page.waitForURL(/\/#laboratorio|\/$/);
  await page.waitForTimeout(800);
  const onLab = await page.evaluate(() => {
    const el = document.getElementById("laboratorio");
    if (!el) return { ok: false, reason: "missing" };
    const r = el.getBoundingClientRect();
    return {
      ok: r.top < window.innerHeight * 0.85 && r.bottom > 40,
      top: r.top,
      path: location.pathname + location.hash,
    };
  });
  await assert(onLab.ok, `da /portraits arriva a laboratorio (${JSON.stringify(onLab)})`);

  await browser.close();
  console.log("\nESITO: POSITIVO — tutti i test navbar Laboratorio ok");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
