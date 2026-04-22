import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

const barraIdx = lines.findIndex(l => l.includes('Barra de modo'));
lines[barraIdx + 1] = "      <div style={{ position: 'fixed', top: headerHeight, left: 0, right: 0, width: '100%', height: '48px', backgroundColor: isSH ? '#FF6835' : '#6BB87A', transition: 'background-color 0.4s ease', zIndex: 299, display: 'flex', alignItems: 'center', paddingRight: '12px' }}>";

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
