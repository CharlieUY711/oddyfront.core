import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/CheckoutPage.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

// Eliminar la primera linea duplicada del import
const firstIdx = lines.findIndex(l => l.includes("useRequireAuth"));
const secondIdx = lines.findIndex((l, i) => i > firstIdx && l.includes("useRequireAuth"));
console.log('Duplicado en:', firstIdx, secondIdx);
lines.splice(firstIdx, 1);

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
