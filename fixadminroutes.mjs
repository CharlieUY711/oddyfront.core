import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/routes.tsx';
let c = readFileSync(file, 'utf8');

c = c.replace(
  "import DashboardLayout",
  `import AdminLayout         from './admin/components/AdminLayout';
import AdminDashboard      from './admin/pages/AdminDashboard';
import AdminProducts       from './admin/pages/AdminProducts';
import AdminOrders         from './admin/pages/AdminOrders';
import AdminAnalytics      from './admin/pages/AdminAnalytics';
import AdminML             from './admin/pages/AdminML';
import DashboardLayout`
);

c = c.replace(
  '{ id: "mis-publicaciones"',
  `{
    id: "admin",
    path: "/admin",
    Component: AdminLayout,
    children: [
      { id: "admin-dashboard",  path: "",            Component: AdminDashboard },
      { id: "admin-products",   path: "products",    Component: AdminProducts },
      { id: "admin-orders",     path: "orders",      Component: AdminOrders },
      { id: "admin-analytics",  path: "analytics",   Component: AdminAnalytics },
      { id: "admin-ml",         path: "ml",          Component: AdminML },
    ] as RouteObject[],
  },
  { id: "mis-publicaciones"`
);

writeFileSync(file, c, 'utf8');
console.log('OK');
