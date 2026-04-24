import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/admin/components/AdminLayout.tsx';
let c = readFileSync(file, 'utf8');

c = c.replaceAll('height:"62px"', 'height:"80px"');

writeFileSync(file, c, 'utf8');
console.log('OK');
