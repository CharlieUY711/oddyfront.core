import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

const textIdx = lines.findIndex((l, i) => i > 2864 && i < 2875 && l.includes('<text'));
lines[textIdx] = "                <text x=\"14\" y=\"11.5\" fontSize={11} fill={cartItems.length > 0 ? (isSH ? '#6BB87A' : '#FF6835') : 'transparent'} stroke={cartItems.length > 0 ? (isSH ? '#6BB87A' : '#FF6835') : 'transparent'} strokeWidth={0.1} textAnchor=\"middle\" dominantBaseline=\"middle\">";

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
