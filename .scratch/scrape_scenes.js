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

async function scrapeAllKeyPhotos() {
  const blogs = [
    { blogId: 'zuuruu', logNo: '224391729471' },
    { blogId: 'gkssk1919', logNo: '224392514637' },
    { blogId: 'japchaeunni', logNo: '224388635671' },
    { blogId: 'daily_zero_', logNo: '224393344347' },
    { blogId: 'get_luv', logNo: '224392566159' },
    { blogId: 'freebiekorea', logNo: '224390029491' },
    { blogId: 'ebseb1', logNo: '224386117735' },
    { blogId: 'wise-seo', logNo: '224383739213' }
  ];

  let totalDownloaded = 0;

  for (const b of blogs) {
    const postUrl = `https://blog.naver.com/PostView.naver?blogId=${b.blogId}&logNo=${b.logNo}`;
    try {
      const html = await fetchUrl(postUrl);
      const matches = html.match(/https:\/\/postfiles\.pstatic\.net\/[^"'\s<>]+/g) || [];
      const decoded = matches.map(u => u.replace(/&amp;/g, '&'));
      
      const highRes = decoded.filter(u => {
        return !u.includes('sticker') && !u.includes('emoticon') && (u.includes('type=w966') || u.includes('type=w800') || u.includes('type=w773'));
      });
      const unique = [...new Set(highRes)];
      
      // Select 3 evenly spaced photos throughout the article (e.g. entrance, inside, food/activity)
      const selected = [];
      if (unique.length > 0) selected.push(unique[Math.min(2, unique.length - 1)]);
      if (unique.length > 5) selected.push(unique[Math.floor(unique.length / 2)]);
      if (unique.length > 10) selected.push(unique[unique.length - 4]);

      for (let i = 0; i < selected.length; i++) {
        const imgUrl = selected[i];
        const filename = `${b.blogId}_scene_${i + 1}.jpg`;
        const dest = path.join(targetDir, filename);

        try {
          await downloadBinary(imgUrl, dest);
          const stats = fs.statSync(dest);
          if (stats.size > 25000) {
            totalDownloaded++;
            console.log(`Saved [${b.blogId}_scene_${i + 1}]: ${stats.size} bytes`);
          } else {
            fs.unlinkSync(dest);
          }
        } catch (e) {}
      }
    } catch (e) {}
  }

  console.log(`Downloaded total scene photos: ${totalDownloaded}`);
}

scrapeAllKeyPhotos();
