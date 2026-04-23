import { readFileSync, writeFileSync } from 'fs';

// 1. Crear useRequireAuth.ts
const hook = `import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { supabase } from '../../utils/supabase/client';

export function useRequireAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/?login=true&redirect=' + encodeURIComponent(location.pathname));
      } else {
        setUser(session.user);
      }
      setLoading(false);
    });
  }, []);

  return { loading, user };
}`;

writeFileSync('src/app/hooks/useRequireAuth.ts', hook, 'utf8');
console.log('Hook creado OK');

// 2. Agregar useRequireAuth al CheckoutPage
let checkout = readFileSync('src/app/public/CheckoutPage.tsx', 'utf8');
const lines = checkout.split('\r\n');

// Agregar import despues del primer import
const firstImport = lines.findIndex(l => l.startsWith('import'));
lines.splice(firstImport + 1, 0, "import { useRequireAuth } from '../hooks/useRequireAuth';");

// Agregar hook despues del primer useState en el componente
const navigateIdx = lines.findIndex(l => l.includes('const navigate = useNavigate()'));
lines.splice(navigateIdx + 1, 0,
  "  const { loading: authLoading, user } = useRequireAuth();",
  "  if (authLoading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', color: '#666' }}>Verificando sesión...</div>;"
);

writeFileSync('src/app/public/CheckoutPage.tsx', lines.join('\r\n'), 'utf8');
console.log('CheckoutPage actualizado OK');

// 3. Abrir LoginModal automaticamente si ?login=true en OddyStorefront
let store = readFileSync('src/app/public/OddyStorefront.tsx', 'utf8');
const storeLines = store.split('\r\n');

// Buscar donde se inicializa showLoginModal
const loginModalIdx = storeLines.findIndex(l => l.includes("const [showLoginModal, setShowLoginModal] = useState(false)"));
console.log('loginModal en:', loginModalIdx);
storeLines[loginModalIdx] = `  const [showLoginModal, setShowLoginModal] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('login') === 'true';
    }
    return false;
  });`;

writeFileSync('src/app/public/OddyStorefront.tsx', storeLines.join('\r\n'), 'utf8');
console.log('OddyStorefront actualizado OK');
