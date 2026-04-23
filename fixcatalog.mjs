import { readFileSync, writeFileSync } from 'fs';

// 1. Agregar ruta
const routesFile = 'src/app/routes.tsx';
let routes = readFileSync(routesFile, 'utf8');
routes = routes.replace(
  "import AdminML",
  "import AdminCatalog from './admin/pages/AdminCatalog';\nimport AdminML"
);
routes = routes.replace(
  '{ id: "admin-ml"',
  '{ id: "admin-catalog", path: "catalog", Component: AdminCatalog },\n      { id: "admin-ml"'
);
writeFileSync(routesFile, routes, 'utf8');

// 2. Agregar al sidebar
const layoutFile = 'src/app/admin/components/AdminLayout.tsx';
let layout = readFileSync(layoutFile, 'utf8');
layout = layout.replace(
  '{ path: "/admin/ml"',
  '{ path: "/admin/catalog", label: "📋 Catálogo" },\n    { path: "/admin/ml"'
);
writeFileSync(layoutFile, layout, 'utf8');

console.log('OK');
