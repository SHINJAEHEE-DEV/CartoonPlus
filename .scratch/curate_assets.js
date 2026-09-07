const fs = require('fs');
const path = require('path');

// 1. Clean public/assets old photos
const publicAssets = 'public/assets';
if (fs.existsSync(publicAssets)) {
  const files = fs.readdirSync(publicAssets);
  for (const f of files) {
    const full = path.join(publicAssets, f);
    if (fs.statSync(full).isFile()) {
      fs.unlinkSync(full);
    } else if (fs.statSync(full).isDirectory()) {
      fs.rmSync(full, { recursive: true, force: true });
    }
  }
}

// 2. Setup curated store photos in docs/assets/store_photos
const photosDir = 'docs/assets/store_photos';
const curated = [
  { from: 'zuuruu_photo_2.jpg', to: '01_store_exterior.jpg', title: '매장 건물 외관 및 CARTOON+ 간판' },
  { from: 'gkssk1919_photo_4.jpg', to: '02_entrance_and_guide.jpg', title: '매장 입구, 신발장 및 이용 가이드' },
  { from: 'ebseb1_scene_1.jpg', to: '03_kiosk_system.jpg', title: '무인 키오스크 입실/퇴실 시스템' },
  { from: 'ebseb1_scene_2.jpg', to: '04_bookshelf_and_rooms.jpg', title: '도서 서가 및 2층 복층 아늑한 굴방' },
  { from: 'ebseb1_scene_3.jpg', to: '05_massage_chair_zone.jpg', title: '무료 프리미엄 안마의자 힐링 존' },
  { from: 'wise-seo_scene_2.jpg', to: '06_boardgame_shelf.jpg', title: '100여 종 인기 보드게임 진열대' },
  { from: 'zuuruu_photo_1.jpg', to: '07_manga_collection.jpg', title: '인기 만화 및 소년/순정 단행본 서가' },
  { from: 'wise-seo_scene_1.jpg', to: '08_webtoon_reading.jpg', title: '인기 웹툰 단행본 열람' }
];

for (const c of curated) {
  const fromPath = path.join(photosDir, c.from);
  const toPath = path.join(photosDir, c.to);
  if (fs.existsSync(fromPath)) {
    fs.copyFileSync(fromPath, toPath);
  }
}

// Remove uncurated raw blog photos from photosDir
const allInPhotos = fs.readdirSync(photosDir);
for (const f of allInPhotos) {
  if (!f.startsWith('0')) {
    fs.unlinkSync(path.join(photosDir, f));
  }
}

// 3. Rename capture to official SNU partnership banner
if (fs.existsSync('docs/assets/캡처.PNG')) {
  fs.copyFileSync('docs/assets/캡처.PNG', 'docs/assets/snu_partnership_banner.png');
}

// 4. Mascot logo copy to mascot dir
if (fs.existsSync('docs/assets/media_1788621287340.png')) {
  fs.copyFileSync('docs/assets/media_1788621287340.png', 'docs/assets/mascot/mascot_logo_circle.png');
}

console.log('Cleanup and curation finished successfully.');
