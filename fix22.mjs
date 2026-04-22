import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

const dupIdx = lines.findIndex(l => l.includes("width: '140px'") && l.includes('Second Hand'));
console.log('Span duplicado en linea:', dupIdx);
lines.splice(dupIdx, 1);

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
