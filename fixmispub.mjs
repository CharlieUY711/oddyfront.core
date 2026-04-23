import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/routes.tsx';
let c = readFileSync(file, 'utf8');
c = c.replace(
  "import DashboardPage",
  "import MisPublicacionesPage from './public/MisPublicacionesPage';\nimport DashboardPage"
);
c = c.replace(
  "{ id: \"dashboard\"",
  "{ id: \"mis-publicaciones\", path: \"/mis-publicaciones\", Component: MisPublicacionesPage },\n  { id: \"dashboard\""
);
writeFileSync(file, c, 'utf8');
console.log('OK');
