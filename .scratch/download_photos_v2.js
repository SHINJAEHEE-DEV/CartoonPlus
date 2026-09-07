const https = require('https');
const fs = require('fs');
const path = require('path');

const photoDir = path.join('public', 'assets', 'photos');
if (!fs.existsSync(photoDir)) fs.mkdirSync(photoDir, { recursive: true });

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

async function run() {
  const blogs = [
    { blogId: 'zuuruu', logNo: '224391729471' },
    { blogId: 'gkssk1919', logNo: '224392514637' },
    { blogId: 'japchaeunni', logNo: '224388635671' },
    { blogId: 'daily_zero_', logNo: '224393344347' },
    { blogId: 'get_luv', logNo: '224392566159' },
    { blogId: 'freebiekorea', logNo: '224390029491' }
  ];

  const downloaded = [];
  let count = 0;

  for (const b of blogs) {
    const postUrl = 'https://blog.naver.com/PostView.naver?blogId=' + b.blogId + '&logNo=' + b.logNo;
    try {
      const html = await fetchUrl(postUrl);
      const imgRegex = /https:\/\/postfiles\.pstatic\.net\/[^"'\s<>]+/g;
      const matches = html.match(imgRegex) || [];
      const cleanList = [...new Set(matches.map(u => u.replace(/&amp;/g, '&')))];

      console.log(`Blog ${b.blogId}: found ${cleanList.length} images`);
      const picks = cleanList.slice(0, 3);

      for (let i = 0; i < picks.length; i++) {
        count++;
        const imgUrl = picks[i];
        const ext = imgUrl.includes('.png') ? 'png' : 'jpg';
        const filename = `blog_${b.blogId}_${i + 1}.${ext}`;
        const dest = path.join(photoDir, filename);

        try {
          await downloadBinary(imgUrl, dest);
          downloaded.push({
            filename: `assets/photos/${filename}`,
            blogId: b.blogId,
            sourceUrl: imgUrl
          });
          console.log(`[Success ${count}] Downloaded: ${filename}`);
        } catch (e) {
          console.error(`[Fail] ${filename}: ${e.message}`);
        }
      }
    } catch (err) {
      console.error('Error fetching blog', b.blogId, err.message);
    }
  }

  fs.writeFileSync('public/assets/downloaded-photos-meta.json', JSON.stringify(downloaded, null, 2), 'utf8');
  console.log(`Done! Total downloaded: ${downloaded.length}`);
}

run();
