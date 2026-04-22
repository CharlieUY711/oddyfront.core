import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

const spanIdx = lines.findIndex(l => l.includes("width: '110px'") && l.includes('Second Hand'));
console.log('Span en linea:', spanIdx);
lines[spanIdx] = "            <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.05rem', width: '70px', display: 'inline-block', textAlign: 'center' }}>";

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
