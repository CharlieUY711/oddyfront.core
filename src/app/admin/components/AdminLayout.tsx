import { useEffect, useRef, useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router";
import { supabase } from "../../../utils/supabase/client";
import { useUserRole } from "../hooks/useUserRole";

const SIDEBAR_BG  = "#0F3460";
const ACCENT      = "#FF7A00";

function UserAvatar({ user, isAdmin }: { user: any; isAdmin: boolean }) {
  const [avatar, setAvatar] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(`avatar_${user?.id}`);
    if (saved) setAvatar(saved);
  }, [user]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setAvatar(dataUrl);
      localStorage.setItem(`avatar_${user?.id}`, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ lineHeight:1 }}>
              <span style={{ color: ACCENT, fontWeight:900, fontSize:"1.75rem", letterSpacing:"-0.03em" }}>ODDY</span>
              <span style={{ color:"#fff", fontWeight:400, fontSize:"1.75rem", letterSpacing:"-0.03em" }}> Panel</span>
            </div>
          </Link>
        </div>

        {/* User info + Avatar */}
        <UserAvatar user={user} isAdmin={isAdmin} />

        {/* Nav */}
        <nav style={{ flex:1, padding:"0.75rem 0", overflowY:"auto" }}>

          {/* Sección General */}
          <div style={{ padding:"0.5rem 1.5rem 0.3rem", fontSize:"0.63rem", fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:"0.1em" }}>
            General
          </div>
          {commonMenu.map(item => {
            const active = isActive(item.path, item.exact);
            return (
              <Link key={item.path} to={item.path} style={{
                display:"block", padding:"0.55rem 1.5rem", textDecoration:"none", fontSize:"0.875rem",
                background: active ? `rgba(255,122,0,0.15)` : "transparent",
                color: active ? ACCENT : "rgba(255,255,255,0.62)",
                borderLeft: active ? `3px solid ${ACCENT}` : "3px solid transparent",
                fontWeight: active ? 600 : 400, transition:"all 0.12s",
              }}>{item.label}</Link>
            );
          })}

          {/* Sección Admin */}
          {isAdmin && (
            <>
              <div style={{ padding:"0.75rem 1.5rem 0.3rem", fontSize:"0.63rem", fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:"0.1em", marginTop:"0.5rem" }}>
                Administración
              </div>
              {adminMenu.map(item => {
                const active = isActive(item.path, item.exact);
                return (
                  <Link key={item.path} to={item.path} style={{
                    display:"block", padding:"0.55rem 1.5rem", textDecoration:"none", fontSize:"0.875rem",
                    background: active ? `rgba(255,122,0,0.15)` : "transparent",
                    color: active ? ACCENT : "rgba(255,255,255,0.62)",
                    borderLeft: active ? `3px solid ${ACCENT}` : "3px solid transparent",
                    fontWeight: active ? 600 : 400, transition:"all 0.12s",
                  }}>{item.label}</Link>
                );
              })}
            </>
          )}
        </nav>

        {/* Cerrar sesión */}
        <div style={{ padding:"1rem 1.5rem", borderTop:"1px solid rgba(255,255,255,0.08)" }}>
          <button onClick={async () => { await supabase.auth.signOut(); navigate("/"); }}
            style={{ width:"100%", padding:"0.45rem 0.75rem", background:"transparent", border:"1px solid rgba(255,255,255,0.18)", color:"rgba(255,255,255,0.5)", borderRadius:"7px", cursor:"pointer", fontSize:"0.78rem", transition:"all 0.15s" }}>
            🚪 Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>

        {/* Topbar */}
        <header style={{ background: SIDEBAR_BG, padding:"0 2rem", height:"70px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:10 }}>
          <h1 style={{ margin:0, fontSize:"0.95rem", fontWeight:700, color:"rgba(255,255,255,0.9)" }}>
            {[...commonMenu, ...adminMenu].find(m => isActive(m.path, m.exact))?.label?.split(" ").slice(1).join(" ") || "Dashboard"}
          </h1>
          <Link to="/" style={{ color: ACCENT, textDecoration:"none", fontSize:"0.82rem", fontWeight:600, padding:"0.35rem 0.9rem", border:`1px solid ${ACCENT}`, borderRadius:"6px", transition:"all 0.15s" }}>
            Ver tienda
          </Link>
        </header>

        {/* Content */}
        <main style={{ flex:1, overflow:"auto", padding:"2rem" }}>
          <Outlet context={{ user, isAdmin }} />
        </main>
      </div>
    </div>
  );
}
