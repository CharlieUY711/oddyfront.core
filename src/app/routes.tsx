/* =====================================================
   ODDY Frontstore Standalone — Router Config (React Router v7)
   Solo rutas públicas de la frontstore
   ===================================================== */
import { createBrowserRouter } from 'react-router';
import MensajePage             from './public/MensajePage';
import OddyStorefront          from './public/OddyStorefront';
import CarritoPage             from './public/CarritoPage';
import CheckoutPage            from './public/CheckoutPage';
import OrdenPage               from './public/OrdenPage';

export const router = createBrowserRouter([
  /* ── Raíz — Frontstore (público) ───────────── */
  {
    path: '/',
    Component: OddyStorefront,
  },

  /* ── Tienda (Storefront) — alias ───────────── */
  {
    path: '/tienda',
    Component: OddyStorefront,
  },

  /* ── Carrito y Checkout ────────────────────── */
  {
    path: '/carrito',
    Component: CarritoPage,
  },
  {
    path: '/checkout',
    Component: CheckoutPage,
  },
  {
    path: '/orden/:id',
    Component: OrdenPage,
  },

  /* ── Etiqueta Emotiva — pública ─────────────── */
  {
    path: '/m/:token',
    Component: MensajePage,
  },
]);