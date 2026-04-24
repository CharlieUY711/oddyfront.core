import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/admin/components/AdminLayout.tsx';
let c = readFileSync(file, 'utf8');

// Sidebar 240px
c = c.replace(/width:"[0-9]+px"/, 'width:"240px"');

// Topbar height 80px — todos los lugares
c = c.replaceAll('height:"62px"', 'height:"80px"');
c = c.replaceAll('height:"56px"', 'height:"80px"');

writeFileSync(file, c, 'utf8');
console.log('Sidebar:', c.match(/width:"[0-9]+px"/)?.[0]);
console.log('Topbar heights:', c.match(/height:"80px"/g)?.length, 'ocurrencias');
