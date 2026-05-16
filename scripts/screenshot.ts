import { chromium } from "playwright";

const BASE = "http://localhost:3002";
const PASSWORD = "demo2025";
const CUSTOMER_ID = "cmp8denos001khxjjxqiy623c";

async function main() {
  const browser = await chromium.launch({
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();

  // 1. Login page
  await page.goto(`${BASE}/login`);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "docs/screenshots/01-login.png", fullPage: false });

  // 2. Login and wait for redirect
  await page.fill('input[name="password"]', PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(5000);

  // 3. Homepage
  await page.screenshot({ path: "docs/screenshots/02-homepage.png", fullPage: false });

  // 4. Customers list
  await page.goto(`${BASE}/customers`);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "docs/screenshots/03-customers.png", fullPage: false });

  // 5. Customer detail
  await page.goto(`${BASE}/customers/${CUSTOMER_ID}`);
  await page.waitForTimeout(2500);
  await page.screenshot({ path: "docs/screenshots/04-detail.png", fullPage: false });

  // 6. New customer
  await page.goto(`${BASE}/customers/new`);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "docs/screenshots/05-new-customer.png", fullPage: false });

  // 7. AI analyses
  await page.goto(`${BASE}/ai-analyses`);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "docs/screenshots/06-ai-analyses.png", fullPage: false });

  // 8. Tags
  await page.goto(`${BASE}/tags`);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "docs/screenshots/07-tags.png", fullPage: false });

  await browser.close();
  console.log("Screenshots done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
