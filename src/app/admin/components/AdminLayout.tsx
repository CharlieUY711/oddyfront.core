import { useState, useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router";
import { supabase } from "../../../utils/supabase/client";

export default function AdminLayout() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user || user.user_metadata?.role !== "admin") {
        navigate("/");
      } else {
        setUser(user);
      }
    });
  }, []);

  const menu = [
    { path: "/admin",           label: "📊 Dashboard",    exact: true },
    { path: "/admin/products",  label: "📦 Productos" },
    { path: "/admin/orders",    label: "🛍 Órdenes" },
    { path: "/admin/analytics", label: "📈 Analytics" },
    { path: "/admin/ml",        label: "🟡 MercadoLibre" },
  ];

  const isActive = (path: string, exact?: boolean) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "DM Sans, sans-serif", background: "#F4F5F7" }}>
      <aside style={{ width: "220px", background: "#1a1a2e", display: "flex", flexDirection: "column", padding: "1.5rem 0", position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ padding: "0 1.5rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <div style={{ color: "#FF6835", fontWeight: 800, fontSize: "1.1rem" }}>ODDY</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem" }}>Admin Panel</div>
          </Link>
        </div>
        <nav style={{ flex: 1, padding: "1rem 0" }}>
          {menu.map(item => (
            <Link key={item.path} to={item.path} style={{
              display: "block", padding: "0.65rem 1.5rem", textDecoration: "none", fontSize: "0.9rem",
              background: isActive(item.path, item.exact) ? "rgba(255,104,53,0.15)" : "transparent",
              color: isActive(item.path, item.exact) ? "#FF6835" : "rgba(255,255,255,0.65)",
              borderLeft: isActive(item.path, item.exact) ? "3px solid #FF6835" : "3px solid transparent",
              transition: "all 0.15s",
            }}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", marginBottom: "0.5rem" }}>{user?.email}</div>
          <button onClick={async () => { await supabase.auth.signOut(); navigate("/"); }}
            style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)", padding: "0.4rem 0.75rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem", width: "100%" }}>
            Cerrar sesión
          </button>
        </div>
      </aside>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <header style={{ background: "#fff", padding: "0 2rem", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #E5E7EB", position: "sticky", top: 0, zIndex: 10 }}>
          <h1 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#222" }}>
            {menu.find(m => isActive(m.path, m.exact))?.label?.split(" ").slice(1).join(" ") || "Dashboard"}
          </h1>
          <Link to="/" style={{ color: "#FF6835", textDecoration: "none", fontSize: "0.85rem" }}>Ver tienda →</Link>
        </header>
        <main style={{ flex: 1, overflow: "auto", padding: "2rem" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
