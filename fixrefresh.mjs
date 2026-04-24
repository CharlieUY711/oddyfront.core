import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

// 1. Eliminar botones "Actualizar" / "🔄" de todas las páginas admin
const dir = 'src/app/admin/pages';
const files = readdirSync(dir).filter(f => f.endsWith('.tsx'));

files.forEach(filename => {
  const path = join(dir, filename);
  let c = readFileSync(path, 'utf8');
  const before = c;

  // Eliminar botones de refresh con distintos patrones
  c = c.replace(/<button onClick=\{[^}]*refetch[^}]*\}[^>]*>[\s\S]*?🔄[\s\S]*?<\/button>\s*/g, '');
  c = c.replace(/<button onClick=\{[^}]*load[^}]*\}[^>]*>[\s\S]*?🔄[\s\S]*?<\/button>\s*/g, '');
  c = c.replace(/<button onClick=\{[^}]*Actualizar[^}]*\}[^>]*>[^<]*Actualizar[^<]*<\/button>\s*/g, '');

  if (c !== before) { writeFileSync(path, c, 'utf8'); console.log('✓ Cleaned:', filename); }
  else console.log('- No change:', filename);
});

// 2. Agregar refresh button en AdminLayout topbar (una sola vez estructural)
const layoutFile = 'src/app/admin/components/AdminLayout.tsx';
let layout = readFileSync(layoutFile, 'utf8');

// Agregar useCallback y el boton refresh al topbar si no existe ya
if (!layout.includes('onRefresh') && !layout.includes('reload')) {
  // Agregar boton entre h1 y Ver tienda
  layout = layout.replace(
    '<Link to="/" style={{ color: ACCENT, textDecoration:"none"',
    `<button onClick={() => window.location.reload()}
            title="Actualizar"
            style={{ background:"transparent", border:\`1px solid rgba(255,255,255,0.3)\`, color:"rgba(255,255,255,0.7)", width:"34px", height:"34px", borderRadius:"50%", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1rem", transition:"all 0.15s" }}>
            ↻
          </button>
          <Link to="/" style={{ color: ACCENT, textDecoration:"none"`
  );
  console.log('✓ Refresh button agregado al topbar');
}

writeFileSync(layoutFile, layout, 'utf8');
console.log('OK');
