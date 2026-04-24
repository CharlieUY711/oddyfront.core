import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/admin/components/AdminLayout.tsx';
let c = readFileSync(file, 'utf8');

// Sidebar: 200px -> 220px (+10%)
c = c.replace('width:"200px"', 'width:"220px"');

// Topbar height: 56px -> 62px (+10%)
c = c.replace('height:"56px"', 'height:"62px"');

// Logo section height: 56px -> 62px
c = c.replace('height:"56px", display:"flex", alignItems:"center" }', 'height:"62px", display:"flex", alignItems:"center" }');

writeFileSync(file, c, 'utf8');
console.log('OK');
