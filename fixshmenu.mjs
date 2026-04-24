import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/admin/components/AdminLayout.tsx';
let c = readFileSync(file, 'utf8');

c = c.replace(
  "{ path: \"/admin/profile\",      label: \"👤 Mi perfil\",                     adminOnly: false },",
  `{ path: "/admin/profile",      label: "👤 Mi perfil",                     adminOnly: false },
    { path: "/admin/publicaciones", label: "♻️ Mis publicaciones",              adminOnly: false },`
);

writeFileSync(file, c, 'utf8');
console.log('OK');
