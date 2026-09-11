import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '../dist');

const routes = [
  {
    path: '/books',
    title: '도서 검색 | 카툰플러스 서울대입구역점',
    description: '카툰플러스 서울대입구역점의 실시간 도서 재고와 서가 위치를 검색하세요. 초성 검색 지원.',
  },
  {
    path: '/menu',
    title: '메뉴 안내 | 카툰플러스 서울대입구역점',
    description: '카툰플러스 서울대입구역점의 맛있는 식사와 음료, 스낵 메뉴를 확인하세요.',
  },
  {
    path: '/events',
    title: '진행 중인 이벤트 | 카툰플러스 서울대입구역점',
    description: '카툰플러스 서울대입구역점에서 진행 중인 특별한 혜택과 이벤트를 확인하세요.',
  },
  {
    path: '/games',
    title: '보드게임 & 닌텐도 | 카툰플러스 서울대입구역점',
    description: '카툰플러스 서울대입구역점에 구비된 닌텐도 스위치, PS4 게임과 다양한 보드게임 목록입니다.',
  },
  {
    path: '/store',
    title: '이용 요금 & 매장 안내 | 카툰플러스 서울대입구역점',
    description: '카툰플러스 서울대입구역점의 위치, 영업시간, 이용 요금을 안내해 드립니다.',
  },
  {
    path: '/new-arrivals',
    title: '신규 입고 도서 | 카툰플러스 서울대입구역점',
    description: '최근 30일 내에 카툰플러스 서울대입구역점에 새롭게 입고된 도서들을 확인하세요.',
  }
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
    let routeHtml = baseHtml.replace(
      /<title>.*?<\/title>/s,
      `<title>${route.title}</title>`
    );

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
  
  console.log('SSG Generation complete.');
}

generateSSG().catch(console.error);
