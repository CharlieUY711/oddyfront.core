import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/admin/components/AdminLayout.tsx';
let c = readFileSync(file, 'utf8');

// Reemplazar el boton refresh actual (con circulo) por uno mas grande sin circulo
c = c.replace(
  `<button onClick={() => window.location.reload()}
            title="Actualizar"
            style={{ background:"transparent", border:\`1px solid rgba(255,255,255,0.3)\`, color:"rgba(255,255,255,0.7)", width:"34px", height:"34px", borderRadius:"50%", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1rem", transition:"all 0.15s" }}>
            ↻
          </button>`,
  `<button onClick={() => window.location.reload()}
            title="Actualizar"
            style={{ background:"transparent", border:"none", color:"rgba(255,255,255,0.7)", cursor:"pointer", fontSize:"1.5rem", lineHeight:1, padding:"0 0.25rem", transition:"color 0.15s" }}
            onMouseEnter={e=>(e.currentTarget.style.color="#fff")}
            onMouseLeave={e=>(e.currentTarget.style.color="rgba(255,255,255,0.7)")}>
            ↻
          </button>`
);

writeFileSync(file, c, 'utf8');
console.log('OK');
