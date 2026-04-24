import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/routes.tsx';
let c = readFileSync(file, 'utf8');
c = c.replace(
  "import AdminML",
  "import AdminProfile from './admin/pages/AdminProfile';\nimport AdminML"
);
c = c.replace(
  '{ id: "admin-catalog"',
  '{ id: "admin-profile", path: "profile", Component: AdminProfile },\n      { id: "admin-catalog"'
);
writeFileSync(file, c, 'utf8');
console.log('OK');
