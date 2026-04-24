import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/admin/components/AdminLayout.tsx';
let c = readFileSync(file, 'utf8');
c = c.replace('fontSize:"1.15rem"', 'fontSize:"1.25rem"');
writeFileSync(file, c, 'utf8');
console.log('OK');
