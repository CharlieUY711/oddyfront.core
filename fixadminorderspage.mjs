import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/admin/pages/AdminOrders.tsx';
let c = readFileSync(file, 'utf8');
c = c.replace(
  'import { useAdminOrders } from "../hooks/useAdminOrders";',
  'import { useAdminOrders } from "../hooks/useAdminOrders";\nimport { useOutletContext } from "react-router";'
);
c = c.replace(
  'export default function AdminOrders() {',
  'export default function AdminOrders() {\n  const { isAdmin } = useOutletContext<any>() || {};'
);
c = c.replace(
  'const { orders, loading, error, refetch } = useAdminOrders(200);',
  'const { orders, loading, error, refetch } = useAdminOrders(200, isAdmin);'
);
writeFileSync(file, c, 'utf8');
console.log('OK');
