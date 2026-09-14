const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({
        executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
        headless: true,
        defaultViewport: { width: 1200, height: 800 }
    });
    const page = await browser.newPage();
    const reportsDir = path.resolve('.scratch/site-comparison/reports');
    const files = fs.readdirSync(reportsDir).filter(f => f.endsWith('-1.report.html'));
    
    for (const file of files) {
        const fileUrl = 'file:///' + path.join(reportsDir, file).replace(/\\/g, '/');
        await page.goto(fileUrl, { waitUntil: 'networkidle0' });
        
        const outPath = path.join('C:/Users/JaeHeeShin/.gemini/antigravity/brain/9ef957f8-542b-47d3-aa60-d3f87739554e/screenshots', file.replace('.html', '.jpeg'));
        await page.screenshot({ path: outPath, type: 'jpeg', clip: { x: 0, y: 0, width: 1200, height: 600 } });
        console.log('Saved', outPath);
    }
    await browser.close();
})();
