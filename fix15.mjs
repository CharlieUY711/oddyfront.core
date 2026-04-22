import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

const carouselIdx = lines.findIndex(l => l.includes('ref={carouselRef}') && l.includes('flex: 1'));
console.log('Carrusel en linea:', carouselIdx);
lines[carouselIdx] = "        <div ref={carouselRef} style={{ display: 'flex', gap: '6px', alignItems: 'center', overflow: 'hidden', height: '100%', paddingLeft: '6px', paddingRight: '12px', flex: 1 }}>";

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
