import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/admin/components/AdminLayout.tsx';
let c = readFileSync(file, 'utf8');

// Cambiar padding del logo para centrarlo verticalmente en el topbar (56px)
c = c.replace(
  '{ padding:"1.5rem 1.5rem 1rem" }',
  '{ padding:"0 1.5rem", height:"56px", display:"flex", alignItems:"center" }'
);

// Quitar el margen del Link interno
c = c.replace(
  '<Link to="/" style={{ textDecoration:"none" }}>',
  '<Link to="/" style={{ textDecoration:"none", display:"flex", alignItems:"center" }}>'
);

writeFileSync(file, c, 'utf8');
console.log('OK');
