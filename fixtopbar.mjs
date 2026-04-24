import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/admin/components/AdminLayout.tsx';
let c = readFileSync(file, 'utf8');

// Cambiar ancho sidebar de 230px a 210px para dar mas espacio al topbar
// y cambiar el topbar padding de 0 2rem a 0 2.5rem
c = c.replace(
  'width:"230px"',
  'width:"200px"'
);

// Quitar icono del boton Ver tienda
c = c.replace(
  '🏪 Ver tienda',
  'Ver tienda'
);

writeFileSync(file, c, 'utf8');
console.log('OK');
