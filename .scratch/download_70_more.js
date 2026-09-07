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

async function download70More() {
  // Load blog list
  const blogList = JSON.parse(fs.readFileSync('.scratch/blog_list.json', 'utf8'));
  console.log(`Searching through ${blogList.length} blogs for additional photos...`);

  let meta = [];
  if (fs.existsSync('docs/assets/store_photos_meta.json')) {
    meta = JSON.parse(fs.readFileSync('docs/assets/store_photos_meta.json', 'utf8'));
  }

  // Already downloaded URLs
  const seenUrls = new Set(meta.map(m => m.sourceUrl));
  let photoIndex = meta.length + 1;
  const targetTotal = meta.length + 75; // 32 + 75 = 107 photos

  for (const b of blogList) {
    if (photoIndex > targetTotal) break;

    const postUrl = `https://blog.naver.com/PostView.naver?blogId=${b.blogId}&logNo=${b.logNo}`;
    try {
      const html = await fetchUrl(postUrl);
      if (!html.includes('카툰플러스')) continue;

      const matches = html.match(/https:\/\/postfiles\.pstatic\.net\/[^"'\s<>]+/g) || [];
      const decoded = matches.map(u => u.replace(/&amp;/g, '&'));
      
      const highRes = decoded.filter(u => {
        return !u.includes('sticker') && 
               !u.includes('emoticon') && 
               !u.includes('profile') &&
               (u.includes('type=w966') || u.includes('type=w800') || u.includes('type=w773') || u.includes('.jpg') || u.includes('.png'));
      });

      const unique = [...new Set(highRes)];

      for (const imgUrl of unique) {
        if (photoIndex > targetTotal) break;
        if (seenUrls.has(imgUrl)) continue;
        seenUrls.add(imgUrl);

        const numStr = String(photoIndex).padStart(3, '0');
        const filename = `store_photo_${numStr}.jpg`;
        const dest = path.join(targetDir, filename);

        try {
          await downloadBinary(imgUrl, dest);
          const stats = fs.statSync(dest);

          // Keep all substantial photos (> 20KB) so user can filter
          if (stats.size > 20000) {
            meta.push({
              index: photoIndex,
              filename: `docs/assets/store_photos/${filename}`,
              blogId: b.blogId,
              sizeBytes: stats.size,
              sourceUrl: imgUrl
            });
            console.log(`[+${photoIndex}] Saved ${filename} (${Math.round(stats.size / 1024)} KB) from ${b.blogId}`);
            photoIndex++;
          } else {
            fs.unlinkSync(dest);
          }
        } catch (e) {}
      }
    } catch (e) {}
  }

  fs.writeFileSync('docs/assets/store_photos_meta.json', JSON.stringify(meta, null, 2), 'utf8');
  console.log(`FINISHED: Total store photos in docs/assets/store_photos/: ${meta.length}`);
}

download70More();
