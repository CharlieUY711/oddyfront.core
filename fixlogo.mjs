import { readFileSync, writeFileSync } from 'fs';
const file = 'src/styles/oddy.css';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

const logoIdx = lines.findIndex(l => l.trim() === '.oddy-logo {');
console.log('Logo en:', logoIdx);
console.log(lines[logoIdx + 1]);
console.log(lines[logoIdx + 2]);

lines[logoIdx + 1] = '  height: 28px;';
lines[logoIdx + 2] = '  width: 47px;';

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
