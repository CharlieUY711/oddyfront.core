import { createBrowserRouter, type RouteObject } from "react-router";
import OddyStorefront from "./public/OddyStorefront";
import CarritoPage    from "./public/CarritoPage";
import CheckoutPage   from "./public/CheckoutPage";
import OrdenPage      from "./public/OrdenPage";
import MensajePage    from "./public/MensajePage";
import MisPublicacionesPage from './public/MisPublicacionesPage';
import DashboardPage from './public/DashboardPage';
import SuccessPage    from "./public/SuccessPage";
import FailurePage    from "./public/FailurePage";
import PendingPage    from "./public/PendingPage";

export const TODAS_LAS_RUTAS: (RouteObject & { id: string })[] = [
  { id: "storefront",      path: "/",          Component: OddyStorefront },
  { id: "tienda",          path: "/tienda",    Component: OddyStorefront },
  { id: "carrito",         path: "/carrito",   Component: CarritoPage },
  { id: "checkout",        path: "/checkout",  Component: CheckoutPage },
  { id: "orden",           path: "/orden/:id", Component: OrdenPage },
  { id: "etiqueta-emotiva",path: "/m/:token",  Component: MensajePage },
  { id: "mis-publicaciones", path: "/mis-publicaciones", Component: MisPublicacionesPage },
  { id: "dashboard", path: "/dashboard", Component: DashboardPage },
  { id: "success",         path: "/success",   Component: SuccessPage },
  { id: "failure",         path: "/failure",   Component: FailurePage },
  { id: "pending",         path: "/pending",   Component: PendingPage },
];

export const router = createBrowserRouter(TODAS_LAS_RUTAS);
