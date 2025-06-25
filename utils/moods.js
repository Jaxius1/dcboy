import fs from 'fs';
import path from 'path';

const moodsFile = path.join(process.cwd(), 'moods.json');

export function readMoods() {
  if (!fs.existsSync(moodsFile)) return {};
  const data = fs.readFileSync(moodsFile, 'utf8');
  return JSON.parse(data);
}

export function writeMoods(data) {
  fs.writeFileSync(moodsFile, JSON.stringify(data, null, 2));
}
