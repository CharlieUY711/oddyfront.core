import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

const spanIdx = lines.findIndex(l => l.includes("cartItems.length > 0 && <span") && l.includes("position: 'absolute'"));
console.log('span en:', spanIdx);
lines[spanIdx] = "              {cartItems.length > 0 && <span style={{ position: 'absolute', top: '-6px', right: '-6px', fontSize: '10px', color: isSH ? '#6BB87A' : '#FF6835', fontFamily: \"'Arial', sans-serif\", fontWeight: 'normal', lineHeight: 1, zIndex: 10 }}>{cartItems.length}</span>}";

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
