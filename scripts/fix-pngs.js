const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');

function walk(dir) {
  const results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results.push(...walk(filePath));
    } else {
      results.push(filePath);
    }
  }
  return results;
}

(async function main(){
  const files = walk(root).filter(f => f.toLowerCase().endsWith('.png'));
  console.log('Found', files.length, 'png files');
  for (const f of files) {
    try {
      const buf = fs.readFileSync(f);
      // Skip tiny files
      if (buf.length < 100) continue;
      // Try to decode and re-encode as PNG
      await sharp(buf).png({ quality: 90 }).toBuffer().then(out => fs.writeFileSync(f, out));
      console.log('Re-encoded', path.relative(root, f));
    } catch (e) {
      console.error('Failed to process', f, e.message);
    }
  }
})();
