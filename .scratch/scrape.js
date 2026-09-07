const https = require('https');
const fs = require('fs');
const path = require('path');

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

async function run() {
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

  const scrapedBlogs = [];

  for (const b of blogs) {
    const postUrl = 'https://blog.naver.com/PostView.naver?blogId=' + b.blogId + '&logNo=' + b.logNo;
    try {
      const html = await fetchUrl(postUrl);
      if (!html.includes('카툰플러스')) continue;

      const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
      const title = titleMatch ? titleMatch[1].replace(/\n/g, '').trim() : b.blogId;

      const imgRegex = /https:\/\/postfiles\.pstatic\.net\/[a-zA-Z0-9_%?=&;.~-]+/g;
      const rawImgs = html.match(imgRegex) || [];
      const cleanImgs = [...new Set(rawImgs.map(u => u.split('?')[0]))];

      scrapedBlogs.push({
        blogId: b.blogId,
        logNo: b.logNo,
        url: 'https://blog.naver.com/' + b.blogId + '/' + b.logNo,
        title: title,
        imageCount: cleanImgs.length,
        images: cleanImgs
      });
      console.log('Scraped:', b.blogId, 'Images:', cleanImgs.length);
    } catch (e) {
      console.error('Error on', b.blogId, e.message);
    }
  }

  fs.writeFileSync('public/assets/scraped-blogs.json', JSON.stringify(scrapedBlogs, null, 2), 'utf8');
  console.log('Saved scraped-blogs.json successfully. Total blogs:', scrapedBlogs.length);
}

run();
