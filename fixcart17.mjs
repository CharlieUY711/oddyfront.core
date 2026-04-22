import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

const idx = lines.findIndex(l => l.includes('cartItems.length}') && l.includes('fontWeight'));
console.log('en linea:', idx);
lines[idx] = lines[idx]
  .replace('y="11.5"', 'y="9.5"')
  .replace('fontWeight="normal"', 'fontWeight="normal"')
  .replace("fontFamily: 'Arial, sans-serif'", "fontFamily: 'Arial, sans-serif', fontStyle: 'normal'");

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
