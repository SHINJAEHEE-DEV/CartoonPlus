const https = require('https');
const fs = require('fs');
const path = require('path');

const targetDir = path.join('docs', 'assets', 'store_photos');
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function downloadBinary(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Referer': 'https://blog.naver.com/' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadBinary(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error('Status ' + res.statusCode));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(destPath);
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

async function scrapeRealPhotos() {
  // Clear any existing temp files in targetDir
  const oldFiles = fs.readdirSync(targetDir);
  for (const f of oldFiles) {
    fs.unlinkSync(path.join(targetDir, f));
  }

  const blogs = [
    { name: 'zuuruu', blogId: 'zuuruu', logNo: '224391729471' },
    { name: 'gkssk1919', blogId: 'gkssk1919', logNo: '224392514637' },
    { name: 'japchaeunni', blogId: 'japchaeunni', logNo: '224388635671' },
    { name: 'daily_zero', blogId: 'daily_zero_', logNo: '224393344347' },
    { name: 'get_luv', blogId: 'get_luv', logNo: '224392566159' }
  ];

  const downloadedList = [];

  for (const b of blogs) {
    const postUrl = `https://blog.naver.com/PostView.naver?blogId=${b.blogId}&logNo=${b.logNo}`;
    try {
      const html = await fetchUrl(postUrl);
      
      // Look for full size image URLs in blog post body (type=w966 or type=w800 or similar high-res)
      const matches = html.match(/https:\/\/postfiles\.pstatic\.net\/[^"'\s<>]+/g) || [];
      const decoded = matches.map(u => u.replace(/&amp;/g, '&'));
      
      // Filter out small stickers/icons and keep high-res post images
      const highResImages = decoded.filter(u => {
        return !u.includes('sticker') && !u.includes('emoticon') && (u.includes('type=w966') || u.includes('type=w800') || u.includes('type=w773') || u.includes('.jpg') || u.includes('.png'));
      });

      const uniqueImgs = [...new Set(highResImages)];
      console.log(`Blog ${b.name}: Found ${uniqueImgs.length} high-res real post photos`);

      // Download first 4-5 key photos from body
      let count = 0;
      for (let i = 0; i < uniqueImgs.length && count < 4; i++) {
        const imgUrl = uniqueImgs[i];
        const filename = `${b.name}_photo_${count + 1}.jpg`;
        const dest = path.join(targetDir, filename);

        try {
          await downloadBinary(imgUrl, dest);
          const stats = fs.statSync(dest);
          // Only keep if file size > 30KB (real photos are typically 50KB~2MB)
          if (stats.size > 30000) {
            count++;
            downloadedList.push({
              filename: `docs/assets/store_photos/${filename}`,
              blogId: b.blogId,
              sizeBytes: stats.size,
              sourceUrl: imgUrl
            });
            console.log(`Saved real photo [${b.name}_${count}]: ${stats.size} bytes`);
          } else {
            fs.unlinkSync(dest);
          }
        } catch (e) {
          // ignore error
        }
      }
    } catch (e) {
      console.error(`Error on blog ${b.name}: ${e.message}`);
    }
  }

  console.log(`Scraping complete. Total real store photos: ${downloadedList.length}`);
}

scrapeRealPhotos();
