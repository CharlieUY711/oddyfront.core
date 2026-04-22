import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

lines[2866] = '                  <text x="14" y="9.5" fontSize="9" fill={isSH ? \'#6BB87A\' : \'#FF6835\'} fontWeight="normal" stroke="none" textAnchor="middle" dominantBaseline="middle" style={{ fontFamily: \'Arial, sans-serif\', fontWeight: \'normal\', pointerEvents: \'none\' }}>';

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
