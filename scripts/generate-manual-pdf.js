import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUTPUT_PDF = path.join(ROOT, "output/pdf/cartoonplus-staff-console-manual.pdf");
const SCREENSHOTS_DIR = path.join(ROOT, "docs/assets/manual-screenshots");
const MASCOT_DIR = path.join(ROOT, "dist/assets/mascot");
const TEMPLATE_FILE = path.join(ROOT, "scripts/manual_template.html");

function imgBase64(filePath) {
  if (!fs.existsSync(filePath)) return "";
  const ext = path.extname(filePath).slice(1);
  const data = fs.readFileSync(filePath).toString("base64");
  return "data:image/" + ext + ";base64," + data;
}

const mascotLogo = imgBase64(path.join(MASCOT_DIR, "mascot_logo_circle.png"));
const img01 = imgBase64(path.join(SCREENSHOTS_DIR, "01_login_page.png"));
const img02 = imgBase64(path.join(SCREENSHOTS_DIR, "02_dashboard.png"));
const img03 = imgBase64(path.join(SCREENSHOTS_DIR, "03_inventory.png"));
const img04 = imgBase64(path.join(SCREENSHOTS_DIR, "04_book_requests.png"));
const img05 = imgBase64(path.join(SCREENSHOTS_DIR, "05_store_content.png"));
const img06 = imgBase64(path.join(SCREENSHOTS_DIR, "06_games.png"));
const img07 = imgBase64(path.join(SCREENSHOTS_DIR, "07_events.png"));
const img08 = imgBase64(path.join(SCREENSHOTS_DIR, "08_broadcast.png"));
const img09 = imgBase64(path.join(SCREENSHOTS_DIR, "09_admin_accounts.png"));

let html = fs.readFileSync(TEMPLATE_FILE, "utf-8");
html = html.replaceAll("{{mascotLogo}}", mascotLogo);
html = html.replaceAll("{{img01}}", img01);
html = html.replaceAll("{{img02}}", img02);
html = html.replaceAll("{{img03}}", img03);
html = html.replaceAll("{{img04}}", img04);
html = html.replaceAll("{{img05}}", img05);
html = html.replaceAll("{{img06}}", img06);
html = html.replaceAll("{{img07}}", img07);
html = html.replaceAll("{{img08}}", img08);
html = html.replaceAll("{{img09}}", img09);

async function build() {
  fs.mkdirSync(path.dirname(OUTPUT_PDF), { recursive: true });
  console.log("Launching browser for PDF generation...");
  const browser = await puppeteer.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  
  console.log("Rendering PDF to " + OUTPUT_PDF + "...");
  await page.pdf({
    path: OUTPUT_PDF,
    format: "A4",
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  await browser.close();
  console.log("PDF generated successfully! Output: " + OUTPUT_PDF);
}

build().catch(err => {
  console.error("PDF generation failed:", err);
  process.exit(1);
});
