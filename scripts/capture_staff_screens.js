import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.resolve(__dirname, "../docs/assets/manual-screenshots");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
    defaultViewport: { width: 1280, height: 800, deviceScaleFactor: 2 },
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  console.log("Navigating to staff login...");
  await page.goto("http://localhost:5173/staff", { waitUntil: "networkidle0" });
  await page.screenshot({ path: path.join(OUTPUT_DIR, "01_login_page.png") });

  console.log("Logging in as admin...");
  await page.type("input[name=\"loginId\"]", "admin");
  await page.type("input[name=\"password\"]", "cartoonplus");
  await Promise.all([
    page.click("button[type=\"submit\"]"),
    page.waitForNavigation({ waitUntil: "networkidle0" }).catch(() => {}),
  ]);

  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "02_dashboard.png") });

  const routes = [
    { url: "http://localhost:5173/staff/inventory", name: "03_inventory" },
    { url: "http://localhost:5173/staff/requests", name: "04_book_requests" },
    { url: "http://localhost:5173/staff/content", name: "05_store_content" },
    { url: "http://localhost:5173/staff/games", name: "06_games" },
    { url: "http://localhost:5173/staff/events", name: "07_events" },
    { url: "http://localhost:5173/staff/broadcast", name: "08_broadcast" },
    { url: "http://localhost:5173/staff/accounts", name: "09_admin_accounts" },
  ];

  for (const r of routes) {
    console.log("Navigating to " + r.url);
    await page.goto(r.url, { waitUntil: "networkidle0" });
    await new Promise(res => setTimeout(res, 600));
    await page.screenshot({ path: path.join(OUTPUT_DIR, r.name + ".png") });
  }

  console.log("Screenshots captured successfully.");
  await browser.close();
}

capture().catch(err => {
  console.error("Capture failed:", err);
  process.exit(1);
});
