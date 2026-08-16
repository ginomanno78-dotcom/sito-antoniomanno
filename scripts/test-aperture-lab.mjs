import { chromium } from "playwright";

const BASE = "http://localhost:3000";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  await page.addInitScript(() => {
    try {
      sessionStorage.setItem("antoniomanno_intro_seen", "1");
    } catch {}
  });
  await page.goto(BASE + "/#laboratorio", { waitUntil: "networkidle" });
  await page.evaluate(() => {
    document.documentElement.removeAttribute("data-intro");
    document.getElementById("iubenda-cs-banner")?.remove();
  });
  await page.addStyleTag({
    content: "#iubenda-cs-banner{display:none!important;pointer-events:none!important}",
  });
  await page.waitForTimeout(600);

  const title = await page.locator("text=Aperture and Depth of Field").count();
  const slider = page.locator('input[type=range][aria-label="Aperture value"]');
  await slider.waitFor({ state: "visible" });
  await slider.fill("3");
  await page.waitForTimeout(250);

  const visibleIdx = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll("img")].filter((i) =>
      (i.alt || "").includes("blurred")
    );
    return imgs.findIndex((i) => getComputedStyle(i).display !== "none");
  });

  await page.locator("#option-3").check();
  await page.locator("button", { hasText: "Check" }).click();
  await page.waitForTimeout(500);

  const dialogTitle = await page.evaluate(() => {
    const d = [...document.querySelectorAll("dialog")].find((x) => x.open);
    return d?.querySelector("p")?.textContent?.trim() ?? null;
  });

  console.log(
    JSON.stringify(
      { title, visibleIdx, dialogTitle, ok: title >= 1 && visibleIdx === 2 && dialogTitle === "Well Done!" },
      null,
      2
    )
  );
  await browser.close();
  if (!(title >= 1 && visibleIdx === 2 && dialogTitle === "Well Done!")) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
