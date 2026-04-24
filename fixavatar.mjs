import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/admin/components/AdminLayout.tsx';
let c = readFileSync(file, 'utf8');

// Reemplazar la seccion de user info con avatar clickeable
const oldUserInfo = `        {/* User info */}
        <div style={{ padding:"0.75rem 1.5rem 1rem", borderBottom:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", gap:"0.6rem" }}>
          <div style={{ width:"32px", height:"32px", borderRadius:"50%", background: isAdmin ? "rgba(255,122,0,0.2)" : "rgba(107,184,122,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1rem", flexShrink:0 }}>
            {isAdmin ? "👑" : "👤"}
          </div>
          <div style={{ minWidth:0 }}>
            <div style={{ color:"rgba(255,255,255,0.9)", fontSize:"0.78rem", fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              {user?.email}
            </div>
            <div style={{ color: isAdmin ? ACCENT : "#6BB87A", fontSize:"0.68rem", fontWeight:700, marginTop:"1px" }}>
              {isAdmin ? "Administrador" : "Usuario"}
            </div>
          </div>
        </div>`;

const newUserInfo = `        {/* User info + Avatar */}
        <UserAvatar user={user} isAdmin={isAdmin} />`;

c = c.replace(oldUserInfo, newUserInfo);

// Agregar componente UserAvatar antes del export default
c = c.replace(
  'export default function AdminLayout()',
  `function UserAvatar({ user, isAdmin }: { user: any; isAdmin: boolean }) {
  const [avatar, setAvatar] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(\`avatar_\${user?.id}\`);
    if (saved) setAvatar(saved);
  }, [user]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setAvatar(dataUrl);
      localStorage.setItem(\`avatar_\${user?.id}\`, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ padding:"0.75rem 1.5rem 1rem", borderBottom:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", gap:"0.75rem" }}>
      <div onClick={() => inputRef.current?.click()}
        style={{ width:"40px", height:"40px", borderRadius:"50%", flexShrink:0, cursor:"pointer", overflow:"hidden", border:\`2px solid \${isAdmin ? "#FF7A00" : "#6BB87A"}\`, position:"relative", background:"rgba(255,255,255,0.08)" }}
        title="Cambiar foto">
        {avatar
          ? <img src={avatar} alt="avatar" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          : <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.1rem" }}>
              {isAdmin ? "👑" : "👤"}
            </div>
        }
        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.35)", display:"flex", alignItems:"center", justifyContent:"center", opacity:0, transition:"opacity 0.2s" }}
          onMouseEnter={e=>(e.currentTarget.style.opacity="1")}
          onMouseLeave={e=>(e.currentTarget.style.opacity="0")}>
          <span style={{ color:"#fff", fontSize:"0.6rem", fontWeight:700 }}>📷</span>
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} style={{ display:"none" }} />
      <div style={{ minWidth:0 }}>
        <div style={{ color:"rgba(255,255,255,0.9)", fontSize:"0.78rem", fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
          {user?.email}
        </div>
        <div style={{ color: isAdmin ? "#FF7A00" : "#6BB87A", fontSize:"0.68rem", fontWeight:700, marginTop:"1px" }}>
          {isAdmin ? "Administrador" : "Usuario"}
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout()`
);

// Agregar useRef al import de react
c = c.replace(
  'import { useEffect } from "react";',
  'import { useEffect, useRef, useState } from "react";'
);

writeFileSync(file, c, 'utf8');
console.log('OK');
