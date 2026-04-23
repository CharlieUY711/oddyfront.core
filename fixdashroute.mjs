import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/routes.tsx';
let c = readFileSync(file, 'utf8');
c = c.replace(
  "import SuccessPage",
  "import DashboardPage from './public/DashboardPage';\nimport SuccessPage"
);
c = c.replace(
  "{ id: \"success\"",
  "{ id: \"dashboard\", path: \"/dashboard\", Component: DashboardPage },\n  { id: \"success\""
);
writeFileSync(file, c, 'utf8');
console.log('OK');
