import { createBrowserRouter, type RouteObject } from "react-router";
<<<<<<< HEAD
import OddyStorefront          from "./public/OddyStorefront";
import CarritoPage             from "./public/CarritoPage";
import CheckoutPage            from "./public/CheckoutPage";
import OrdenPage               from "./public/OrdenPage";
import MensajePage             from "./public/MensajePage";
import SuccessPage             from "./public/SuccessPage";
import FailurePage             from "./public/FailurePage";
import PendingPage             from "./public/PendingPage";
import DashboardRedirect       from "./public/DashboardRedirect";
import AdminLayout             from "./admin/components/AdminLayout";
import AdminDashboard          from "./admin/pages/AdminDashboard";
import AdminProducts           from "./admin/pages/AdminProducts";
import AdminOrders             from "./admin/pages/AdminOrders";
import AdminAnalytics          from "./admin/pages/AdminAnalytics";
import AdminML                 from "./admin/pages/AdminML";
import AdminCatalog            from "./admin/pages/AdminCatalog";
import AdminProfile            from "./admin/pages/AdminProfile";
import AdminPublicaciones      from "./admin/pages/AdminPublicaciones";
=======
import OddyStorefront         from "./public/OddyStorefront";
import CarritoPage            from "./public/CarritoPage";
import CheckoutPage           from "./public/CheckoutPage";
import OrdenPage              from "./public/OrdenPage";
import MensajePage            from "./public/MensajePage";
import SuccessPage            from "./public/SuccessPage";
import FailurePage            from "./public/FailurePage";
import PendingPage            from "./public/PendingPage";
import DashboardLayout        from "./public/DashboardLayout";
import DashboardOrdenes       from "./public/DashboardOrdenes";
import DashboardPublicaciones from "./public/DashboardPublicaciones";
import DashboardPerfil        from "./public/DashboardPerfil";
import AdminLayout            from "./admin/components/AdminLayout";
import AdminDashboard         from "./admin/pages/AdminDashboard";
import AdminProducts          from "./admin/pages/AdminProducts";
import AdminOrders            from "./admin/pages/AdminOrders";
import AdminAnalytics         from "./admin/pages/AdminAnalytics";
import AdminML                from "./admin/pages/AdminML";
>>>>>>> parent of fbf8f64b (feat: AdminCatalog - departments/categories/subcategories CRUD, hooks, catalogService, RPCs)

export const TODAS_LAS_RUTAS: (RouteObject & { id: string })[] = [
  { id: "storefront",          path: "/",           Component: OddyStorefront },
  { id: "tienda",              path: "/tienda",     Component: OddyStorefront },
  { id: "carrito",             path: "/carrito",    Component: CarritoPage },
  { id: "checkout",            path: "/checkout",   Component: CheckoutPage },
  { id: "orden",               path: "/orden/:id",  Component: OrdenPage },
  { id: "etiqueta-emotiva",    path: "/m/:token",   Component: MensajePage },
  { id: "success",             path: "/success",    Component: SuccessPage },
  { id: "failure",             path: "/failure",    Component: FailurePage },
  { id: "pending",             path: "/pending",    Component: PendingPage },
  { id: "dashboard-redirect",  path: "/dashboard",  Component: DashboardRedirect },
  { id: "dashboard-redirect2", path: "/dashboard/*",Component: DashboardRedirect },
  {
    id: "admin", path: "/admin", Component: AdminLayout,
    children: [
<<<<<<< HEAD
      { id: "admin-dashboard",      path: "",              Component: AdminDashboard },
      { id: "admin-orders",         path: "orders",        Component: AdminOrders },
      { id: "admin-publicaciones",  path: "publicaciones", Component: AdminPublicaciones },
      { id: "admin-profile",        path: "profile",       Component: AdminProfile },
      { id: "admin-products",       path: "products",      Component: AdminProducts },
      { id: "admin-catalog",        path: "catalog",       Component: AdminCatalog },
      { id: "admin-analytics",      path: "analytics",     Component: AdminAnalytics },
      { id: "admin-ml",             path: "ml",            Component: AdminML },
=======
      { id: "admin-dashboard",  path: "",           Component: AdminDashboard },
      { id: "admin-products",   path: "products",   Component: AdminProducts },
      { id: "admin-orders",     path: "orders",     Component: AdminOrders },
      { id: "admin-analytics",  path: "analytics",  Component: AdminAnalytics },
      { id: "admin-ml",         path: "ml",         Component: AdminML },
>>>>>>> parent of fbf8f64b (feat: AdminCatalog - departments/categories/subcategories CRUD, hooks, catalogService, RPCs)
    ] as RouteObject[],
  },
];

export const router = createBrowserRouter(TODAS_LAS_RUTAS);
