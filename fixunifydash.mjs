import { readFileSync, writeFileSync } from 'fs';

// Actualizar routes.tsx — eliminar rutas dashboard, agregar redirect
const routesFile = 'src/app/routes.tsx';
let routes = readFileSync(routesFile, 'utf8');

// Eliminar imports de dashboard publico
routes = routes.replace(/import DashboardLayout[^\n]+\n/, '');
routes = routes.replace(/import DashboardOrdenes[^\n]+\n/, '');
routes = routes.replace(/import DashboardPublicaciones[^\n]+\n/, '');
routes = routes.replace(/import DashboardPerfil[^\n]+\n/, '');

// Eliminar bloque de rutas dashboard
routes = routes.replace(/\s*\{\s*id:\s*"dashboard"[\s\S]*?\} as RouteObject\[\],\s*\},/, '');

// Agregar redirect de /dashboard a /admin
routes = routes.replace(
  '{ id: "storefront"',
  '{ id: "dashboard-redirect", path: "/dashboard", Component: () => { const { useEffect } = require("react"); const { useNavigate } = require("react-router"); const C = () => { const n = useNavigate(); useEffect(()=>n("/admin",{replace:true}),[n]); return null; }; return C; } },\n  { id: "storefront"'
);

writeFileSync(routesFile, routes, 'utf8');
console.log('routes OK');
