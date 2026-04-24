import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/admin/components/AdminLayout.tsx';
let c = readFileSync(file, 'utf8');

c = c.replace(
  `        <div style={{ color:"rgba(255,255,255,0.9)", fontSize:"0.75rem", fontWeight:600,
          overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:"140px" }}>
          {user?.email}
        </div>`,
  `        <div style={{ color:"rgba(255,255,255,0.9)", fontSize:"0.75rem", fontWeight:600,
          overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:"140px" }}>
          {user?.user_metadata?.nombre || user?.email?.split("@")[0] || "Usuario"}
        </div>`
);

writeFileSync(file, c, 'utf8');
console.log('OK');
