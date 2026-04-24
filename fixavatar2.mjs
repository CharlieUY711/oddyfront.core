import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/admin/components/AdminLayout.tsx';
let c = readFileSync(file, 'utf8');

const oldAvatar = c.match(/function UserAvatar[\s\S]*?^}/m)?.[0];

const newAvatar = `function UserAvatar({ user, isAdmin }: { user: any; isAdmin: boolean }) {
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
    <div style={{ padding:"1rem 1.5rem", borderBottom:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", gap:"0.75rem" }}>
      {/* Círculo avatar */}
      <div style={{ position:"relative", flexShrink:0 }}>
        <div onClick={() => inputRef.current?.click()}
          style={{ width:"44px", height:"44px", borderRadius:"50%", cursor:"pointer", overflow:"hidden",
            border:\`2px solid \${isAdmin ? "#FF7A00" : "#6BB87A"}\`,
            background:"rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center" }}>
          {avatar
            ? <img src={avatar} alt="avatar" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            : <span style={{ fontSize:"1.25rem" }}>{isAdmin ? "👑" : "👤"}</span>
          }
        </div>
        {/* Botón cámara */}
        <div onClick={() => inputRef.current?.click()}
          style={{ position:"absolute", bottom:"-2px", right:"-2px", width:"18px", height:"18px", borderRadius:"50%",
            background:"#FF7A00", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer",
            fontSize:"0.6rem", border:"2px solid #0A2540" }}>
          📷
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} style={{ display:"none" }} />
      {/* Info */}
      <div style={{ minWidth:0 }}>
        <div style={{ color:"rgba(255,255,255,0.9)", fontSize:"0.75rem", fontWeight:600,
          overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:"140px" }}>
          {user?.email}
        </div>
        <div style={{ color: isAdmin ? "#FF7A00" : "#6BB87A", fontSize:"0.68rem", fontWeight:700, marginTop:"2px" }}>
          {isAdmin ? "Administrador" : "Usuario"}
        </div>
      </div>
    </div>
  );
}`;

// Reemplazar la funcion UserAvatar completa
c = c.replace(/function UserAvatar[\s\S]*?\n\}/m, newAvatar);

writeFileSync(file, c, 'utf8');
console.log('OK');
