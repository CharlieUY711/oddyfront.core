import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

// 1. Agregar estado user despues de showLoginModal
const loginModalIdx = lines.findIndex(l => l.includes("const [showLoginModal, setShowLoginModal]"));
lines.splice(loginModalIdx + 7, 0,
  "  const [currentUser, setCurrentUser] = useState<any>(null);",
  "",
  "  useEffect(() => {",
  "    supabase.auth.getUser().then(({ data: { user } }) => setCurrentUser(user));",
  "    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {",
  "      setCurrentUser(session?.user ?? null);",
  "    });",
  "    return () => subscription.unsubscribe();",
  "  }, []);"
);

// 2. Reemplazar boton Ingreso / Registro por boton dinamico
const btnIdx = lines.findIndex(l => l.includes('oddy-login-btn') && l.includes('Ingreso / Registro'));
lines[btnIdx] = `            {currentUser ? (
              <Link to="/dashboard/ordenes" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '6px', border: '1.5px solid #fff', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem', fontFamily: "'DM Sans', sans-serif" }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                {currentUser.user_metadata?.nombre || currentUser.email?.split('@')[0]}
              </Link>
            ) : (
              <button className="oddy-login-btn" onClick={() => setShowLoginModal(true)}>Ingreso / Registro</button>
            )}`;

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
