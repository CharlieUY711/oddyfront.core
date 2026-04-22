import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

// Linea 2848 (index 2847)
console.log('Antes:', lines[2847]);
lines[2847] = "            <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.05rem', width: '70px', display: 'inline-block', textAlign: 'center' }}>";
console.log('Despues:', lines[2847]);

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
