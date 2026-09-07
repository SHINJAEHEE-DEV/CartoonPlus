const https = require('https');
const fs = require('fs');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function getLatestBlogUrls() {
  const queries = [
    '카툰플러스 서울대입구',
    '카툰플러스 서울대입구역점',
    '서울대입구 만화카페 카툰플러스'
  ];

  const allUrls = new Set();

  for (const q of queries) {
    // search VIEW (Blog)
    const url = 'https://search.naver.com/search.naver?where=view&query=' + encodeURIComponent(q);
    try {
      const html = await fetchUrl(url);
      const regex = /https:\/\/blog\.naver\.com\/([a-zA-Z0-9_-]+)\/([0-9]+)/g;
      let match;
      while ((match = regex.exec(html)) !== null) {
        allUrls.add(JSON.stringify({ blogId: match[1], logNo: match[2] }));
      }
    } catch (e) {
      console.error(e);
    }
  }

  const list = [...allUrls].map(s => JSON.parse(s));
  console.log('Found total unique blog posts:', list.length);
  fs.writeFileSync('.scratch/blog_list.json', JSON.stringify(list, null, 2), 'utf8');
}

getLatestBlogUrls();
