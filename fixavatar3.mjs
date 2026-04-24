import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/admin/components/AdminLayout.tsx';
let c = readFileSync(file, 'utf8');

// Reemplazar el boton camara por lapiz
c = c.replace(
  `        {/* Botón cámara */}
        <div onClick={() => inputRef.current?.click()}
          style={{ position:"absolute", bottom:"-2px", right:"-2px", width:"18px", height:"18px", borderRadius:"50%",
            background:"#FF7A00", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer",
            fontSize:"0.6rem", border:"2px solid #0A2540" }}>
          📷
        </div>`,
  `        {/* Botón editar */}
        <div onClick={() => inputRef.current?.click()}
          style={{ position:"absolute", bottom:"-2px", right:"-2px", width:"18px", height:"18px", borderRadius:"50%",
            background:"#FF7A00", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer",
            fontSize:"0.6rem", border:"2px solid #0A2540" }}>
          ✏️
        </div>`
);

writeFileSync(file, c, 'utf8');
console.log('OK');
