import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyRestofront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

lines[2870] = '                  fontWeight="normal"';

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
