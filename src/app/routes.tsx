/* =====================================================
   ODDY Frontstore Standalone — Router Config (React Router v7)
   Solo rutas públicas de la frontstore
   ===================================================== */
import { createBrowserRouter, type RouteObject } from 'react-router';
import MensajePage             from './public/MensajePage';
import OddyStorefront          from './public/OddyStorefront';
import CarritoPage             from './public/CarritoPage';
import CheckoutPage            from './public/CheckoutPage';
import OrdenPage               from './public/OrdenPage';

/* ── Definición de todas las rutas con IDs de módulos ── */
export const TODAS_LAS_RUTAS: (RouteObject & { id: string })[] = [
  /* ── Raíz — Frontstore (público) ───────────── */
  {
    id: 'ecommerce',
    path: '/',
    Component: OddyStorefront,
  },

  /* ── Tienda (Storefront) — alias ───────────── */
  {
    id: 'ecommerce',
    path: '/tienda',
    Component: OddyStorefront,
  },

  /* ── Carrito y Checkout ────────────────────── */
  {
    id: 'ecommerce',
    path: '/carrito',
    Component: CarritoPage,
  },
  {
    id: 'metodos-pago',
    path: '/checkout',
    Component: CheckoutPage,
  },
  {
    id: 'pedidos',
    path: '/orden/:id',
    Component: OrdenPage,
  },

  /* ── Etiqueta Emotiva — pública ─────────────── */
  {
    id: 'etiqueta-emotiva',
    path: '/m/:token',
    Component: MensajePage,
  },
];

/* ── Router estático (para compatibilidad) ── */
export const router = createBrowserRouter(TODAS_LAS_RUTAS);