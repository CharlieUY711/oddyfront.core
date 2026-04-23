import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/CheckoutPage.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

// Eliminar las 4 lineas sobrantes al final (index 292-295)
console.log('292:', lines[292]);
console.log('293:', lines[293]);
lines.splice(292, 4);

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
