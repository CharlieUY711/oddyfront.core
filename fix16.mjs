import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

// Buscar el cierre del map del carrusel de la barra
const barraIdx = lines.findIndex(l => l.includes('Barra de modo'));
// Buscar ))} despues de la barra
for (let i = barraIdx; i < barraIdx + 20; i++) {
  if (lines[i] && lines[i].trim() === '))}') {
    console.log('Cierre map en linea:', i);
    lines.splice(i + 1, 0, "          <div style={{ flexShrink: 0, width: '12px' }} />");
    break;
  }
}

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
