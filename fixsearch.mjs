import { readFileSync, writeFileSync } from 'fs';
const file = 'src/styles/oddy.css';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

const leftIdx = lines.findIndex(l => l.trim() === '.oddy-header-left {');
const rightIdx = lines.findIndex(l => l.trim() === '.oddy-header-right {');
console.log('Left en:', leftIdx, 'Right en:', rightIdx);

// Agregar width fijo a ambos
lines.splice(leftIdx + 1, 0, '  width: 200px;');
const newRightIdx = lines.findIndex(l => l.trim() === '.oddy-header-right {');
lines.splice(newRightIdx + 1, 0, '  width: 200px;');

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
