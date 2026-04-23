import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

// Eliminar la linea del fontWeight atributo (index 2870)
lines.splice(2870, 1);

// Agregar stroke none al text para evitar herencia del SVG padre
const textIdx = lines.findIndex((l, i) => i > 2864 && i < 2880 && l.includes('<text'));
console.log('text en:', textIdx);
lines[textIdx] = lines[textIdx] + ' stroke="none"';

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
