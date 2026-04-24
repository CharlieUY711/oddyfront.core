import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/admin/components/AdminLayout.tsx';
let c = readFileSync(file, 'utf8');

// 1. Fix titulo ODDY naranja / Panel blanco normal
// El issue es que el replace anterior no aplicó porque el texto es diferente
// Buscamos el div del logo y lo reemplazamos completamente
c = c.replace(
  /<div style=\{.*?fontWeight.*?lineHeight.*?\}>\s*ODDY Panel\s*<\/div>/s,
  `<div style={{ lineHeight:1 }}>
              <span style={{ color: ACCENT, fontWeight:900, fontSize:"1.75rem", letterSpacing:"-0.03em" }}>ODDY</span>
              <span style={{ color:"#fff", fontWeight:400, fontSize:"1.75rem", letterSpacing:"-0.03em" }}> Panel</span>
            </div>`
);

// 2. Quitar el titulo en el topbar (no repetir Dashboard)
// Cambiar h1 por nada, mantener solo el boton Ver tienda
c = c.replace(
  `<h1 style={{ margin:0, fontSize:"0.95rem", fontWeight:700, color:"rgba(255,255,255,0.9)" }}>
          {[...commonMenu, ...adminMenu].find(m => isActive(m.path, m.exact))?.label?.split(" ").slice(1).join(" ") || "Dashboard"}
        </h1>`,
  `<div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
          <span style={{ color:"rgba(255,255,255,0.4)", fontSize:"0.75rem" }}>
            {[...commonMenu, ...adminMenu].find(m => isActive(m.path, m.exact))?.label || ""}
          </span>
        </div>`
);

writeFileSync(file, c, 'utf8');
console.log('OK');
