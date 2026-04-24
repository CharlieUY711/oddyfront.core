import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/admin/components/AdminLayout.tsx';
let c = readFileSync(file, 'utf8');
c = c.replaceAll('height:"80px"', 'height:"70px"');
writeFileSync(file, c, 'utf8');
console.log('OK - ocurrencias:', (c.match(/height:"70px"/g)||[]).length);
