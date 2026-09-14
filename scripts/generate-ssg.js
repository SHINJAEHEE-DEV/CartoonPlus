import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '../dist');

const routes = [
  {
    path: '/about',
    title: '매장 소개 | 카툰플러스',
    description:
      '카툰플러스(서울대입구역점·잠실점·홍대점)의 만화, OTT 룸, 게임, 안마의자와 매장 이용 경험을 소개합니다.',
  },
  {
    path: '/books',
    title: '도서 검색 | 카툰플러스',
    description: '카툰플러스 전 지점의 실시간 도서 재고와 서가 위치를 검색하세요. 초성 검색 지원.',
  },
  {
    path: '/menu',
    title: '메뉴 안내 | 카툰플러스',
    description: '카툰플러스의 맛있는 식사와 음료, 스낵 메뉴를 확인하세요.',
  },
  {
    path: '/events',
    title: '진행 중인 이벤트 | 카툰플러스',
    description: '카툰플러스에서 진행 중인 특별한 혜택과 이벤트를 확인하세요.',
  },
  {
    path: '/games',
    title: '보드게임 & 닌텐도·PS4 | 카툰플러스',
    description: '카툰플러스에 구비된 닌텐도 스위치, PS4 게임과 다양한 보드게임 목록입니다.',
  },
  {
    path: '/store',
    title: '이용 요금 & 매장 안내 | 카툰플러스',
    description: '카툰플러스 지점별 위치, 영업시간, 이용 요금을 안내해 드립니다.',
  },
  {
    path: '/new-arrivals',
    title: '신규 입고 도서 | 카툰플러스',
    description: '최근 30일 내에 카툰플러스에 새롭게 입고된 도서들을 확인하세요.',
  },
  // Store Scoped Routes
  {
    path: '/stores/snu',
    title: '서울대입구역점 도서 검색 | 카툰플러스',
    description: '카툰플러스 서울대입구역점 실시간 도서 재고와 서가 위치 검색.',
  },
  {
    path: '/stores/jamsil',
    title: '잠실점 도서 검색 | 카툰플러스',
    description: '카툰플러스 잠실점 실시간 도서 재고와 서가 위치 검색.',
  },
  {
    path: '/stores/hongdae',
    title: '홍대점 도서 검색 | 카툰플러스',
    description: '카툰플러스 홍대점 실시간 도서 재고와 서가 위치 검색.',
  },
  {
    path: '/stores/jamsil/about',
    title: '잠실점 매장 소개 | 카툰플러스',
    description: '카툰플러스 잠실점의 만화, OTT 룸, 콘솔 게임 및 매장 안내.',
  },
  {
    path: '/stores/hongdae/about',
    title: '홍대점 매장 소개 | 카툰플러스',
    description: '카툰플러스 홍대점의 만화, OTT 룸, 콘솔 게임 및 매장 안내.',
  },
  {
    path: '/stores/jamsil/menu',
    title: '잠실점 메뉴 & 요금 | 카툰플러스',
    description: '카툰플러스 잠실점 이용 요금제 및 식음료 메뉴 안내.',
  },
  {
    path: '/stores/hongdae/menu',
    title: '홍대점 메뉴 & 요금 | 카툰플러스',
    description: '카툰플러스 홍대점 이용 요금제 및 식음료 메뉴 안내.',
  },
  {
    path: '/stores/jamsil/events',
    title: '잠실점 이벤트 | 카툰플러스',
    description: '카툰플러스 잠실점 진행 중인 혜택과 이벤트 안내.',
  },
  {
    path: '/stores/hongdae/events',
    title: '홍대점 이벤트 | 카툰플러스',
    description: '카툰플러스 홍대점 진행 중인 혜택과 이벤트 안내.',
  },
  {
    path: '/stores/jamsil/games',
    title: '잠실점 게임 목록 | 카툰플러스',
    description: '카툰플러스 잠실점 구비 닌텐도 스위치 및 PS4 게임 목록.',
  },
  {
    path: '/stores/hongdae/games',
    title: '홍대점 게임 목록 | 카툰플러스',
    description: '카툰플러스 홍대점 구비 닌텐도 스위치 및 PS4 게임 목록.',
  },
  {
    path: '/stores/jamsil/store',
    title: '잠실점 안내 | 카툰플러스',
    description: '카툰플러스 잠실점 위치, 영업시간 및 연락처 안내.',
  },
  {
    path: '/stores/hongdae/store',
    title: '홍대점 안내 | 카툰플러스',
    description: '카툰플러스 홍대점 위치, 영업시간 및 연락처 안내.',
  },
];

async function generateSSG() {
  const indexPath = path.join(DIST_DIR, 'index.html');
  let baseHtml;
  try {
    baseHtml = await fs.readFile(indexPath, 'utf-8');
  } catch (err) {
    console.error('Error: dist/index.html not found. Please run vite build first.');
    process.exit(1);
  }

  for (const route of routes) {
    const routeDir = path.join(DIST_DIR, route.path.slice(1));
    await fs.mkdir(routeDir, { recursive: true });

    // Replace Title
    let routeHtml = baseHtml.replace(/<title>.*?<\/title>/s, `<title>${route.title}</title>`);

    // Replace Descriptions
    routeHtml = routeHtml.replace(
      /<meta\s+name="description"\s+content="[^"]*"/s,
      `<meta name="description" content="${route.description}"`
    );
    routeHtml = routeHtml.replace(
      /<meta\s+property="og:description"\s+content="[^"]*"/s,
      `<meta property="og:description" content="${route.description}"`
    );
    routeHtml = routeHtml.replace(
      /<meta\s+name="twitter:description"\s+content="[^"]*"/s,
      `<meta name="twitter:description" content="${route.description}"`
    );

    // Replace OG Title / Twitter Title
    routeHtml = routeHtml.replace(
      /<meta\s+property="og:title"\s+content="[^"]*"/s,
      `<meta property="og:title" content="${route.title}"`
    );
    routeHtml = routeHtml.replace(
      /<meta\s+name="twitter:title"\s+content="[^"]*"/s,
      `<meta name="twitter:title" content="${route.title}"`
    );

    const outPath = path.join(routeDir, 'index.html');
    await fs.writeFile(outPath, routeHtml, 'utf-8');
    console.log(`Generated SSG route: ${route.path}/index.html`);
  }

  // Generate sitemap.xml
  const domain = 'https://snu.cartoonplus.co.kr'; // Replace with actual domain if known, assuming a canonical format
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${domain}/</loc></url>
${routes.map((r) => `  <url><loc>${domain}${r.path}</loc></url>`).join('\n')}
</urlset>`;
  await fs.writeFile(path.join(DIST_DIR, 'sitemap.xml'), sitemapContent, 'utf-8');
  console.log('Generated sitemap.xml');

  // Generate robots.txt
  const robotsContent = `User-agent: *
Disallow: /staff

Sitemap: ${domain}/sitemap.xml`;
  await fs.writeFile(path.join(DIST_DIR, 'robots.txt'), robotsContent, 'utf-8');
  console.log('Generated robots.txt');

  // Generate _routes.json for Cloudflare Pages SPA fallback
  const routesJson = {
    version: 1,
    include: ['/*'],
    exclude: ['/assets/*', '/audio/*', '/favicon.ico', '/favicon.svg', '/og-image.png'],
  };
  await fs.writeFile(
    path.join(DIST_DIR, '_routes.json'),
    JSON.stringify(routesJson, null, 2),
    'utf-8'
  );
  console.log('Generated _routes.json');

  console.log('SSG Generation complete.');
}

generateSSG().catch(console.error);
