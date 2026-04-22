import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

// Buscar el texto viejo con fill="#FF6835" y fontWeight="normal"
const oldTextIdx = lines.findIndex(l => l.includes('<text') && !l.includes('cartItems') && !l.includes('fill={'));
console.log('Texto viejo en:', oldTextIdx);

let oldTextEnd = -1;
for (let i = oldTextIdx; i < oldTextIdx + 15; i++) {
  if (lines[i].includes('</text>')) { oldTextEnd = i; break; }
}
console.log('Hasta:', oldTextEnd);

// Eliminar desde <text hasta la linea con "0" y </text>
lines.splice(oldTextIdx, oldTextEnd - oldTextIdx + 2);

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
