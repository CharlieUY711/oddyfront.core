import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

const barraIdx = lines.findIndex(l => l.includes('Barra de modo'));
console.log('Barra idx:', barraIdx);
console.log(lines[barraIdx + 1]);

// Quitar overflow hidden del div padre y agregarlo solo al div interno del carrusel
lines[barraIdx + 1] = lines[barraIdx + 1]
  .replace("overflow: 'hidden'", "overflow: 'visible'");

lines[barraIdx + 2] = lines[barraIdx + 2]
  .replace("overflow: 'hidden'", "overflow: 'hidden'")
  .replace("width: '100%'", "flex: 1, overflow: 'hidden'");

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
