import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

// Ensanchar SVG de 26 a 29px
const svgIdx = lines.findIndex((l, i) => i > 2858 && i < 2875 && l.includes('viewBox="0 0 24 24"') && l.includes('width="26"'));
console.log('SVG en:', svgIdx);
lines[svgIdx] = lines[svgIdx].replace('width="26" height="26"', 'width="29" height="29"');

// Arreglar el texto - fill directo sin stroke
lines[2866] = '                  <text x="14" y="9.5" fontSize="9" fill={isSH ? \'#6BB87A\' : \'#FF6835\'} textAnchor="middle" dominantBaseline="middle" style={{ fontFamily: \'Arial, sans-serif\', fontWeight: \'400\', pointerEvents: \'none\' }}>';

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
