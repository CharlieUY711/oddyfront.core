import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

const idx = lines.findIndex(l => l.includes('cartItems.length}') && l.includes('fontWeight="bold"'));
console.log('en linea:', idx);
lines[idx] = lines[idx].replace('fontWeight="bold"', 'fontWeight="normal"');

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
