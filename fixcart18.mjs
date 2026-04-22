import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

// Linea 2867 (index 2866)
console.log('antes:', lines[2866]);
lines[2866] = '                  <text x="14" y="9.5" fontSize="9" fill={isSH ? \'#6BB87A\' : \'#FF6835\'} fontWeight="normal" textAnchor="middle" dominantBaseline="middle" style={{ fontFamily: \'Arial, sans-serif\', pointerEvents: \'none\' }}>';
console.log('despues:', lines[2866]);

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
