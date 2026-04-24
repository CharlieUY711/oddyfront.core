import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/admin/components/AdminLayout.tsx';
let c = readFileSync(file, 'utf8');

// El topbar tiene: justifyContent:"space-between" con h1 | refresh | Ver tienda
// Queremos: h1 | [grupo derecho: refresh + Ver tienda]
// Envolvemos refresh y Ver tienda en un div flex

c = c.replace(
  `          <button onClick={() => window.location.reload()}
            title="Actualizar"
            style={{ background:"transparent", border:"none", color:"rgba(255,255,255,0.7)", cursor:"pointer", fontSize:"1.5rem", lineHeight:1, padding:"0 0.25rem", transition:"color 0.15s" }}
            onMouseEnter={e=>(e.currentTarget.style.color="#fff")}
            onMouseLeave={e=>(e.currentTarget.style.color="rgba(255,255,255,0.7)")}>
            ↻
          </button>
          <Link to="/" style={{ color: ACCENT, textDecoration:"none", fontSize:"0.82rem", fontWeight:600, padding:"0.35rem 0.9rem", border:\`1px solid \${ACCENT}\`, borderRadius:"6px", transition:"all 0.15s" }}>
            Ver tienda
          </Link>`,
  `          <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
            <button onClick={() => window.location.reload()}
              title="Actualizar"
              style={{ background:"transparent", border:"none", color:"rgba(255,255,255,0.7)", cursor:"pointer", fontSize:"1.5rem", lineHeight:1, padding:"0", transition:"color 0.15s" }}
              onMouseEnter={e=>(e.currentTarget.style.color="#fff")}
              onMouseLeave={e=>(e.currentTarget.style.color="rgba(255,255,255,0.7)")}>
              ↻
            </button>
            <Link to="/" style={{ color: ACCENT, textDecoration:"none", fontSize:"0.82rem", fontWeight:600, padding:"0.35rem 0.9rem", border:\`1px solid \${ACCENT}\`, borderRadius:"6px", transition:"all 0.15s" }}>
              Ver tienda
            </Link>
          </div>`
);

writeFileSync(file, c, 'utf8');
console.log('OK');
