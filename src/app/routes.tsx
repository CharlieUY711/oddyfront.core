import { createBrowserRouter, type RouteObject } from "react-router";
import OddyStorefront from "./public/OddyStorefront";
import CarritoPage    from "./public/CarritoPage";
import CheckoutPage   from "./public/CheckoutPage";
import OrdenPage      from "./public/OrdenPage";
import MensajePage    from "./public/MensajePage";

export const TODAS_LAS_RUTAS: (RouteObject & { id: string })[] = [
  { id: "storefront",      path: "/",         Component: OddyStorefront },
  { id: "tienda",          path: "/tienda",   Component: OddyStorefront },
  { id: "carrito",         path: "/carrito",  Component: CarritoPage },
  { id: "checkout",        path: "/checkout", Component: CheckoutPage },
  { id: "orden",           path: "/orden/:id",Component: OrdenPage },
  { id: "etiqueta-emotiva",path: "/m/:token", Component: MensajePage },
];

export const router = createBrowserRouter(TODAS_LAS_RUTAS);
