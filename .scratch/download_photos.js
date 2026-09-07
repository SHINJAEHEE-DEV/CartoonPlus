const https = require('https');
const fs = require('fs');
const path = require('path');

const photoDir = path.join('public', 'assets', 'photos');
if (!fs.existsSync(photoDir)) fs.mkdirSync(photoDir, { recursive: true });

function downloadBinary(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
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

async function downloadPhotos() {
  const blogs = JSON.parse(fs.readFileSync('public/assets/scraped-blogs.json', 'utf8'));
  const downloaded = [];

  let count = 0;
  for (const b of blogs) {
    // Pick first 2-3 key images per blog
    const picks = b.images.slice(0, 3);
    for (let i = 0; i < picks.length; i++) {
      count++;
      const imgUrl = picks[i];
      const filename = `store_photo_${b.blogId}_${i + 1}.jpg`;
      const dest = path.join(photoDir, filename);
      try {
        await downloadBinary(imgUrl, dest);
        downloaded.push({
          filename: `photos/${filename}`,
          blogId: b.blogId,
          blogUrl: b.url,
          blogTitle: b.title,
          sourceUrl: imgUrl
        });
        console.log(`Downloaded [${count}]: ${filename}`);
      } catch (err) {
        console.error(`Failed to download ${imgUrl}: ${err.message}`);
      }
    }
  }

  fs.writeFileSync('public/assets/downloaded-photos-meta.json', JSON.stringify(downloaded, null, 2), 'utf8');
  console.log(`Finished downloading ${downloaded.length} photos.`);
}

downloadPhotos();
