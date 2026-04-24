import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/admin/components/AdminLayout.tsx';
let c = readFileSync(file, 'utf8');

// 1. Buscar y reemplazar solo el texto "ODDY Panel" dentro del div del logo
// sin tocar la estructura JSX
c = c.replace(
  'ODDY Panel',
  '<><span style={{color:ACCENT,fontWeight:900}}>ODDY</span><span style={{color:"#fff",fontWeight:400}}> Panel</span></>'
);

// 2. Quitar el h1 del topbar - reemplazar por elemento vacio
c = c.replace(
  /<h1 style=\{\{ margin:0, fontSize:"0\.95rem", fontWeight:700, color:"rgba\(255,255,255,0\.9\)" \}\}>\s*\{.*?\}\s*<\/h1>/s,
  '<div />'
);

writeFileSync(file, c, 'utf8');
console.log('OK');
