import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

const newModal = `function LoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [modo, setModo] = useState<'login' | 'registro'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => { if (error) setError(null); }, [email, password]);

  const handleLogin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!email.trim() || !password.trim()) { setError('Completá email y contraseña'); return; }
    setLoading(true); setError(null);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (authError) throw authError;
      if (data.session) {
        onClose();
        const redirectTo = new URLSearchParams(window.location.search).get('redirect') || '/';
        window.history.replaceState({}, '', window.location.pathname);
        navigate(redirectTo);
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally { setLoading(false); }
  };

  const handleRegistro = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!email.trim() || !password.trim()) { setError('Completá email y contraseña'); return; }
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return; }
    setLoading(true); setError(null);
    try {
      const { error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { nombre: nombre.trim() } }
      });
      if (authError) throw authError;
      setMensaje('¡Registro exitoso! Revisá tu email para confirmar tu cuenta.');
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
    } finally { setLoading(false); }
  };

  const handleResetPassword = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!email.trim()) { setError('Ingresá tu email para recuperar la contraseña'); return; }
    try {
      await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: window.location.origin + '/reset' });
      setMensaje('Te enviamos un email para recuperar tu contraseña');
    } catch (err: any) { setError(err.message); }
  };

  if (!isOpen) return null;

  const inputStyle: React.CSSProperties = {
    width: '400px', maxWidth: '90vw', padding: '12px 16px',
    backgroundColor: '#fff', border: '2px solid #FF6835', borderRadius: '8px',
    fontSize: '1rem', outline: 'none', boxSizing: 'border-box',
  };

  const btnPrimary: React.CSSProperties = {
    width: '400px', maxWidth: '90vw', padding: '14px',
    backgroundColor: loading ? '#ccc' : '#FF6835', color: '#fff',
    border: 'none', borderRadius: '8px', fontSize: '1rem',
    fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10000, gap: '16px' }}>

      {/* Toggle Login / Registro */}
      <div onClick={e => e.stopPropagation()} style={{ display: 'flex', background: 'rgba(255,255,255,0.15)', borderRadius: '8px', padding: '4px', gap: '4px', width: '400px', maxWidth: '90vw' }}>
        {(['login', 'registro'] as const).map(m => (
          <button key={m} onClick={() => { setModo(m); setError(null); setMensaje(null); }}
            style={{ flex: 1, padding: '8px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem',
              background: modo === m ? '#fff' : 'transparent',
              color: modo === m ? '#FF6835' : '#fff' }}>
            {m === 'login' ? 'Ingresar' : 'Registrarse'}
          </button>
        ))}
      </div>

      {error && <div onClick={e => e.stopPropagation()} style={{ width: '400px', maxWidth: '90vw', padding: '12px 16px', backgroundColor: '#fee', border: '1px solid #fcc', borderRadius: '8px', color: '#c33', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}
      {mensaje && <div onClick={e => e.stopPropagation()} style={{ width: '400px', maxWidth: '90vw', padding: '12px 16px', backgroundColor: '#efe', border: '1px solid #cfc', borderRadius: '8px', color: '#3c3', fontSize: '0.9rem', textAlign: 'center' }}>{mensaje}</div>}

      {modo === 'registro' && (
        <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre completo" onClick={e => e.stopPropagation()} style={inputStyle} />
      )}

      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" onClick={e => e.stopPropagation()} style={inputStyle} />

      <div onClick={e => e.stopPropagation()} style={{ position: 'relative', width: '400px', maxWidth: '90vw' }}>
        <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña"
          style={{ ...inputStyle, width: '100%', paddingRight: '45px' }}
          onKeyDown={e => { if (e.key === 'Enter' && !loading) modo === 'login' ? handleLogin(e as any) : handleRegistro(e as any); }} />
        <button type="button" onClick={() => setShowPassword(!showPassword)}
          style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
          {showPassword ? '🙈' : '👁'}
        </button>
      </div>

      {modo === 'login' && (
        <span onClick={handleResetPassword} style={{ color: '#fff', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', userSelect: 'none' }}>
          Recuperar contraseña
        </span>
      )}

      <button onClick={modo === 'login' ? handleLogin : handleRegistro} disabled={loading} style={btnPrimary}>
        {loading ? 'Procesando...' : modo === 'login' ? 'Ingresar' : 'Crear cuenta'}
      </button>
    </div>
  );
}`;

// Reemplazar desde linea 2115 hasta 2565 (index 2114 a 2564)
lines.splice(2114, 2565 - 2114, newModal);

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK - lineas reemplazadas');
