import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/admin/components/AdminLayout.tsx';
let c = readFileSync(file, 'utf8');

// 1. Ancho sidebar 200px -> 220px (+10%)
c = c.replace('width:"200px"', 'width:"220px"');

writeFileSync(file, c, 'utf8');
console.log('OK - width actualizado');
