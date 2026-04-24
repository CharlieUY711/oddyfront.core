import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/admin/components/AdminLayout.tsx';
let c = readFileSync(file, 'utf8');

// 1. Agrandar titulo en topbar
c = c.replace(
  'fontSize:"0.95rem", fontWeight:700, color:"rgba(255,255,255,0.9)"',
  'fontSize:"1.15rem", fontWeight:700, color:"rgba(255,255,255,0.9)"'
);

writeFileSync(file, c, 'utf8');
console.log('OK');
