import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlPath = path.resolve(__dirname, '../docs/wireframes/카툰플러스 반응형 목업.html');
const content = fs.readFileSync(htmlPath, 'utf-8');

// Find template script tag
const templateMatch = content.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/);
if (templateMatch) {
  try {
    const templateData = JSON.parse(templateMatch[1]);
    fs.writeFileSync(path.resolve(__dirname, '../docs/wireframes/extracted_template.html'), templateData, 'utf-8');
    console.log('Successfully extracted template to docs/wireframes/extracted_template.html');
  } catch (err) {
    console.error('Error parsing template JSON:', err);
  }
} else {
  console.log('Template script not found');
}

// Find manifest script tag
const manifestMatch = content.match(/<script type="__bundler\/manifest">([\s\S]*?)<\/script>/);
if (manifestMatch) {
  try {
    const manifest = JSON.parse(manifestMatch[1]);
    const keys = Object.keys(manifest);
    console.log(`Manifest contains ${keys.length} resources:`);
    for (const key of keys) {
      const res = manifest[key];
      console.log(` - ${key}: mime=${res.mime}, compressed=${res.compressed}, length=${res.data ? res.data.length : 0}`);
      if (res.mime === 'text/javascript' || res.mime === 'text/html' || res.mime === 'text/plain') {
        const textData = Buffer.from(res.data, 'base64').toString('utf-8');
        fs.writeFileSync(path.resolve(__dirname, `../docs/wireframes/extracted_${key}.js`), textData, 'utf-8');
        console.log(`   -> Extracted text resource to docs/wireframes/extracted_${key}.js`);
      }
    }
  } catch (err) {
    console.error('Error parsing manifest JSON:', err);
  }
}
