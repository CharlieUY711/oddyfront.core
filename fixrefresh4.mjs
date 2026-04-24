import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/admin/components/AdminLayout.tsx';
let c = readFileSync(file, 'utf8');

// Agregar refresh justo antes del Link "Ver tienda"
c = c.replace(
  '<Link to="/" style={{ color: ACCENT',
  `<button onClick={() => window.location.reload()} title="Actualizar"
            style={{ background:"transparent", border:"none", color:"rgba(255,255,255,0.7)", cursor:"pointer", fontSize:"1.4rem", lineHeight:1, padding:"0 0.5rem", transition:"color 0.15s" }}
            onMouseEnter={e=>(e.currentTarget.style.color="#fff")}
            onMouseLeave={e=>(e.currentTarget.style.color="rgba(255,255,255,0.7)")}>
            ↻
          </button>
          <Link to="/" style={{ color: ACCENT`
);

writeFileSync(file, c, 'utf8');
console.log('OK - refresh count:', (c.match(/↻/g)||[]).length);
