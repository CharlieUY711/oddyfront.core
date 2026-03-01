/* =====================================================
   Charlie Marketplace Builder v1.5
   App Root — React Router v7 Data Mode
   ===================================================== */
import { useMemo } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router';
import { useOrchestrator } from '@constructor/shells/DashboardShell/app/providers/OrchestratorProvider';
import { TODAS_LAS_RUTAS } from './routes';

function AppRouter() {
  const { config } = useOrchestrator();

  // Filtrar rutas según config.modulos
  // Si config.modulos está vacío o null, mostrar todas las rutas (comportamiento por defecto)
  const rutasActivas = useMemo(() => {
    if (!config?.modulos || config.modulos.length === 0) {
      return TODAS_LAS_RUTAS;
    }
    return TODAS_LAS_RUTAS.filter(ruta => 
      config.modulos?.includes(ruta.id) ?? true
    );
  }, [config?.modulos]);

  // Crear router dinámicamente con las rutas filtradas
  const router = useMemo(() => {
    return createBrowserRouter(rutasActivas);
  }, [rutasActivas]);

  return <RouterProvider router={router} />;
}

export default function App() {
  return <AppRouter />;
}