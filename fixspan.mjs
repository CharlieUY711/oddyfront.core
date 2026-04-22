import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

const btnIdx = lines.findIndex(l => l.includes('oddy-market-btn') && l.includes('className'));
console.log('Boton en:', btnIdx);
lines.splice(btnIdx - 1, 6,
  "            <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.05rem', minWidth: '140px', display: 'inline-block', textAlign: 'center' }}>",
  "              {isSH ? 'Second Hand' : 'Market'}",
  "            </span>"
);

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
