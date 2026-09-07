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

async function download30Photos() {
  const blogList = JSON.parse(fs.readFileSync('.scratch/blog_list.json', 'utf8'));
  console.log(`Starting to crawl ${blogList.length} blogs...`);

  // Clear existing photos in targetDir
  const existing = fs.readdirSync(targetDir);
  for (const f of existing) {
    fs.unlinkSync(path.join(targetDir, f));
  }

  const collected = [];
  let photoIndex = 1;

  for (const b of blogList) {
    if (photoIndex > 32) break; // target 30-32 photos

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
               (u.includes('type=w966') || u.includes('type=w800') || u.includes('type=w773'));
      });

      const unique = [...new Set(highRes)];
      if (unique.length < 3) continue;

      console.log(`[Blog: ${b.blogId}] Found ${unique.length} candidate photos`);

      // Pick 2-3 well-distributed photos from this post
      const step = Math.max(1, Math.floor(unique.length / 3));
      for (let i = 1; i < unique.length && collected.length < 32; i += step) {
        const imgUrl = unique[i];
        const numStr = String(photoIndex).padStart(2, '0');
        const filename = `store_photo_${numStr}.jpg`;
        const dest = path.join(targetDir, filename);

        try {
          await downloadBinary(imgUrl, dest);
          const stats = fs.statSync(dest);

          // Real high-quality photos should be > 35KB
          if (stats.size > 35000) {
            collected.push({
              index: photoIndex,
              filename: `docs/assets/store_photos/${filename}`,
              blogId: b.blogId,
              sizeBytes: stats.size,
              sourceUrl: imgUrl
            });
            console.log(` -> [${numStr}/30] Saved ${filename} (${Math.round(stats.size / 1024)} KB) from ${b.blogId}`);
            photoIndex++;
          } else {
            fs.unlinkSync(dest);
          }
        } catch (err) {
          // ignore download error
        }
      }
    } catch (err) {
      // ignore
    }
  }

  fs.writeFileSync('docs/assets/store_photos_meta.json', JSON.stringify(collected, null, 2), 'utf8');
  console.log(`SUCCESS: Total ${collected.length} high-res real store photos downloaded into docs/assets/store_photos/`);
}

download30Photos();
