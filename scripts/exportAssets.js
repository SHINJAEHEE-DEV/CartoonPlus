import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlPath = path.resolve(__dirname, '../docs/wireframes/카툰플러스 반응형 목업.html');
const content = fs.readFileSync(htmlPath, 'utf-8');

const publicAssetsDir = path.resolve(__dirname, '../public/assets');
if (!fs.existsSync(publicAssetsDir)) {
  fs.mkdirSync(publicAssetsDir, { recursive: true });
}

// Find manifest script tag
const manifestMatch = content.match(/<script type="__bundler\/manifest">([\s\S]*?)<\/script>/);
if (manifestMatch) {
  const manifest = JSON.parse(manifestMatch[1]);
  const assetMap = {};

  for (const [key, res] of Object.entries(manifest)) {
    if (res.mime && res.mime.startsWith('image/')) {
      const ext = res.mime === 'image/png' ? 'png' : 'jpg';
      const fileName = `${key}.${ext}`;
      const filePath = path.resolve(publicAssetsDir, fileName);
      const buffer = Buffer.from(res.data, 'base64');
      fs.writeFileSync(filePath, buffer);
      console.log(`Saved image: ${fileName} (${buffer.length} bytes)`);
      assetMap[key] = `/assets/${fileName}`;
    }
  }

  fs.writeFileSync(
    path.resolve(__dirname, '../src/assets/assetMap.json'),
    JSON.stringify(assetMap, null, 2),
    'utf-8'
  );
  console.log('Saved assetMap.json!');
}
