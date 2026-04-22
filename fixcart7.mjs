import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

console.log('Linea 2870:', lines[2870]);
console.log('Linea 2884:', lines[2884]);

// Eliminar 15 lineas desde index 2870 (<text hasta </text> + linea con "0")
lines.splice(2870, 15);

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
