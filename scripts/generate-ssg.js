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
      '수만 권의 만화·웹툰, 넷플릭스 OTT룸, 닌텐도 스위치·PS4, 무료 안마의자, 라면 바까지! 프리미엄 힐링 만화카페 카툰플러스를 소개합니다.',
  },
  {
    path: '/books',
    title: '도서 검색 | 카툰플러스',
    description:
      '원하는 만화책의 실시간 서가 위치를 1초 만에 검색하세요! 카툰플러스 전 지점 실시간 도서 재고 및 초성 검색 지원.',
  },
  {
    path: '/menu',
    title: '메뉴 & 요금 안내 | 카툰플러스',
    description:
      '무제한 토핑 즉석 한강라면과 프리미엄 카페 음료, 맛있는 스낵까지! 카툰플러스의 식음료 메뉴와 합리적인 요금제를 확인하세요.',
  },
  {
    path: '/events',
    title: '진행 중인 이벤트 | 카툰플러스',
    description:
      '평일 정액권 할인, 네이버 영수증 리뷰 라면 쿠폰 등 카툰플러스만의 특별한 혜택과 이벤트를 만나보세요.',
  },
  {
    path: '/games',
    title: '보드게임 & 닌텐도·PS4 | 카툰플러스',
    description:
      '마리오카트, 대난투, 스플렌더 등 인기 닌텐도 스위치, PS4 콘솔 게임과 50여 종의 프리미엄 보드게임을 자유롭게 즐기세요.',
  },
  {
    path: '/store',
    title: '이용 요금 & 매장 안내 | 카툰플러스',
    description:
      '카툰플러스 지점별 위치, 영업시간, 주차, 이용 요금 및 편의시설 정보를 상세히 안내해 드립니다.',
  },
  {
    path: '/new-arrivals',
    title: '신규 입고 도서 | 카툰플러스',
    description:
      '카툰플러스에 매주 새롭게 입고되는 인기 신간 만화와 화제의 웹툰 단행본 목록을 가장 빠르게 확인하세요.',
  },
  // Store Scoped Routes
  {
    path: '/stores/snu',
    title: '카툰플러스 서울대입구역점 | 실시간 도서 검색 & 매장 안내',
    description:
      '카툰플러스 서울대입구역점 실시간 도서 재고·서가 위치 검색! 넷플릭스 OTT룸, 닌텐도 스위치, 라면 바 완비 서울대입구 힐링 만화카페.',
  },
  {
    path: '/stores/jamsil',
    title: '카툰플러스 잠실점 | 실시간 도서 검색 & 매장 안내',
    description:
      '카툰플러스 잠실점 실시간 도서 재고·서가 위치 검색! 쾌적한 서가, 프라이빗 룸, 콘솔 게임, 무료 안마의자가 있는 잠실 프리미엄 만화카페.',
  },
  {
    path: '/stores/hongdae',
    title: '카툰플러스 홍대점 | 실시간 도서 검색 & 매장 안내',
    description:
      '카툰플러스 홍대점 실시간 도서 재고·서가 위치 검색! 트렌디한 만화·웹툰 공간, 닌텐도 & 보드게임, 한강라면 바 완비 홍대 힐링 만화카페.',
  },
  {
    path: '/stores/jamsil/about',
    title: '잠실점 매장 소개 | 카툰플러스',
    description:
      '카툰플러스 잠실점의 수만 권 만화, 프라이빗 OTT 룸, 닌텐도 스위치, 최고급 안마의자 무료 힐링 공간을 소개합니다.',
  },
  {
    path: '/stores/hongdae/about',
    title: '홍대점 매장 소개 | 카툰플러스',
    description:
      '카툰플러스 홍대점의 쾌적한 만화 서가, 아늑한 굴방 좌석, 콘솔 게임과 라면 바가 어우러진 복합문화공간을 소개합니다.',
  },
  {
    path: '/stores/jamsil/menu',
    title: '잠실점 메뉴 & 요금 | 카툰플러스',
    description:
      '카툰플러스 잠실점의 실속 있는 시간제 요금제와 즉석 라면, 커피·스무디 등 다양한 식음료 메뉴를 안내합니다.',
  },
  {
    path: '/stores/hongdae/menu',
    title: '홍대점 메뉴 & 요금 | 카툰플러스',
    description:
      '카툰플러스 홍대점의 실속 있는 시간제 요금제와 즉석 라면, 커피·스무디 등 다양한 식음료 메뉴를 안내합니다.',
  },
  {
    path: '/stores/jamsil/events',
    title: '잠실점 이벤트 | 카툰플러스',
    description:
      '카툰플러스 잠실점에서 진행 중인 영수증 리뷰 이벤트와 특별 할인 혜택을 확인하세요.',
  },
  {
    path: '/stores/hongdae/events',
    title: '홍대점 이벤트 | 카툰플러스',
    description:
      '카툰플러스 홍대점에서 진행 중인 다양한 이벤트와 혜택을 확인하세요.',
  },
  {
    path: '/stores/jamsil/games',
    title: '잠실점 게임 목록 | 카툰플러스',
    description:
      '카툰플러스 잠실점 구비 닌텐도 스위치(마리오카트, 태고의 달인 등), PS4 및 보드게임 전체 목록입니다.',
  },
  {
    path: '/stores/hongdae/games',
    title: '홍대점 게임 목록 | 카툰플러스',
    description:
      '카툰플러스 홍대점 구비 닌텐도 스위치, PS4 콘솔 및 인기 보드게임 목록입니다.',
  },
  {
    path: '/stores/jamsil/store',
    title: '잠실점 안내 | 카툰플러스',
    description:
      '카툰플러스 잠실점 위치, 찾아오시는 길, 영업시간, 주차 및 이용 안내.',
  },
  {
    path: '/stores/hongdae/store',
    title: '홍대점 안내 | 카툰플러스',
    description:
      '카툰플러스 홍대점 위치, 찾아오시는 길, 영업시간, 주차 및 이용 안내.',
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
    exclude: [
      '/assets/*',
      '/audio/*',
      '/favicon.ico',
      '/favicon.svg',
      '/favicon-16x16.png',
      '/favicon-32x32.png',
      '/apple-touch-icon.png',
      '/icon-192.png',
      '/icon-512.png',
      '/og-image.png',
      '/site.webmanifest',
      '/robots.txt',
      '/sitemap.xml',
    ],
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
