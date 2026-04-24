import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/routes.tsx';
let c = readFileSync(file, 'utf8');
c = c.replace(
  "import AdminProfile",
  "import AdminPublicaciones from './admin/pages/AdminPublicaciones';\nimport AdminProfile"
);
c = c.replace(
  '{ id: "admin-profile"',
  '{ id: "admin-publicaciones", path: "publicaciones", Component: AdminPublicaciones },\n      { id: "admin-profile"'
);
writeFileSync(file, c, 'utf8');
console.log('OK');
