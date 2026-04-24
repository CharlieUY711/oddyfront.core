import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/admin/components/AdminLayout.tsx';
let c = readFileSync(file, 'utf8');

// Reducir sidebar de 220px a 200px para dar 10% mas al topbar
c = c.replace("width:\"220px\"", "width:\"200px\"");

writeFileSync(file, c, 'utf8');
console.log('OK');
