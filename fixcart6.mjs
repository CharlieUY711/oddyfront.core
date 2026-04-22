import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

// El texto viejo esta en linea 2871 (index 2870)
let oldStart = 2870;
let oldEnd = -1;
for (let i = oldStart; i < oldStart + 15; i++) {
  if (lines[i] && lines[i].includes('</text>')) { oldEnd = i; break; }
}
console.log('Eliminando lineas', oldStart, 'a', oldEnd + 1);
console.log('Primera:', lines[oldStart]);
console.log('Ultima:', lines[oldEnd + 1]);

lines.splice(oldStart, oldEnd - oldStart + 2);

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
