import { readFileSync, writeFileSync } from 'fs';
const file = 'src/styles/oddy.css';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

const mainIdx = lines.findIndex(l => l.trim() === '.oddy-main {');
console.log('Main en:', mainIdx);
console.log('Padding actual:', lines[mainIdx + 1]);

lines[mainIdx + 1] = '  padding-top: 160px;';

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
