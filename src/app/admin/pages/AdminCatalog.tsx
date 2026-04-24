import { useState, useCallback } from "react";
import { useOutletContext } from "react-router";
import { useCatalogTree } from "../hooks/useCatalogTree";
import CatalogTree from "../components/catalog/CatalogTree";

export default function AdminCatalog() {
  const { isAdmin } = useOutletContext<any>() || {};
  const { tree, loading, error, refetch, createNode, updateNode, deleteNode, toggleActive } = useCatalogTree();

  const [search,  setSearch]  = useState("");
  const [toast,   setToast]   = useState<{text:string;ok:boolean}|null>(null);
  const [adding,  setAdding]  = useState(false);
  const [rootName,setRootName]= useState("");

  const notify = useCallback((text: string, ok=true) => {
    setToast({text,ok}); setTimeout(()=>setToast(null), 2800);
  }, []);

  const handleAdd = async (parentId: string, name: string, type: string) => {
    try { await createNode(parentId, name, type); notify(`${name} creado ✓`); }
    catch(e:any) { notify(e.message, false); }
  };

  const handleEdit = async (id: string, name: string) => {
    try { await updateNode(id, name); notify("Actualizado ✓"); }
    catch(e:any) { notify(e.message, false); }
  };

  const handleDelete = async (id: string) => {
    try { await deleteNode(id); notify("Eliminado"); }
    catch(e:any) { notify(e.message, false); }
  };

  const handleToggle = async (id: string, current: boolean) => {
    try { await toggleActive(id, current); notify(current ? "Pausado" : "Activado"); }
    catch(e:any) { notify(e.message, false); }
  };

  const handleAddRoot = async () => {
    if (!rootName.trim()) return;
    await handleAdd("", rootName.trim(), "department");
    setRootName(""); setAdding(false);
  };

  // Filtro de búsqueda recursivo
  const filterTree = (nodes: any[], q: string): any[] => {
    if (!q) return nodes;
    return nodes.reduce((acc, n) => {
      const kids = filterTree(n.children || [], q);
      if (n.name.toLowerCase().includes(q.toLowerCase()) || kids.length > 0)
        acc.push({ ...n, children: kids });
      return acc;
    }, []);
  };

  const visible = filterTree(tree, search);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>

      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed", bottom:"1.5rem", right:"1.5rem", zIndex:9999,
          padding:"0.75rem 1.25rem", borderRadius:"10px", fontWeight:600, fontSize:"0.875rem",
          background: toast.ok?"#f0fdf4":"#fef2f2",
          color: toast.ok?"#166534":"#dc2626",
          border:`1px solid ${toast.ok?"#6BB87A":"#ef4444"}`,
          boxShadow:"0 4px 16px rgba(0,0,0,0.1)" }}>
          {toast.ok?"✅":"❌"} {toast.text}
        </div>
      )}

      {/* Toolbar */}
      <div style={{ display:"flex", gap:"0.75rem", alignItems:"center" }}>
        <div style={{ position:"relative", flex:1 }}>
          <span style={{ position:"absolute", left:"12px", top:"50%", transform:"translateY(-50%)", color:"#9CA3AF" }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Buscar en el catálogo..."
            style={{ width:"100%", padding:"0.55rem 0.75rem 0.55rem 2.25rem",
              border:"1.5px solid #E5E7EB", borderRadius:"10px", fontSize:"0.875rem",
              outline:"none", boxSizing:"border-box", transition:"border-color 0.15s" }}
            onFocus={e=>e.target.style.borderColor="#FF7A00"}
            onBlur={e=>e.target.style.borderColor="#E5E7EB"} />
        </div>
        <button onClick={() => refetch()}
          style={{ padding:"0.55rem 0.75rem", background:"#fff", border:"1.5px solid #E5E7EB",
            borderRadius:"10px", cursor:"pointer", fontSize:"0.875rem", color:"#6B7280",
            transition:"all 0.15s" }}>
          ↻
        </button>
        {isAdmin && (
          <button onClick={() => setAdding(a=>!a)}
            style={{ padding:"0.55rem 1.25rem", background: adding?"#fff":"#FF7A00",
              color: adding?"#FF7A00":"#fff",
              border:"1.5px solid #FF7A00", borderRadius:"10px", cursor:"pointer",
              fontWeight:700, fontSize:"0.875rem", transition:"all 0.15s" }}>
            {adding ? "Cancelar" : "+ Departamento"}
          </button>
        )}
      </div>

      {/* Add root form */}
      {adding && isAdmin && (
        <div style={{ background:"#FFF8F5", border:"2px solid #FF7A00", borderRadius:"12px",
          padding:"1rem 1.25rem", display:"flex", gap:"0.75rem", alignItems:"center" }}>
          <span style={{ fontSize:"1.25rem" }}>🏢</span>
          <input autoFocus value={rootName} onChange={e=>setRootName(e.target.value)}
            placeholder="Nombre del departamento..."
            onKeyDown={e=>{ if(e.key==="Enter") handleAddRoot(); if(e.key==="Escape"){setAdding(false);setRootName("");} }}
            style={{ flex:1, padding:"0.6rem 0.75rem", border:"1.5px solid #FF7A00",
              borderRadius:"8px", fontSize:"0.9rem", outline:"none" }} />
          <button onClick={handleAddRoot} disabled={!rootName.trim()}
            style={{ padding:"0.6rem 1.25rem", background:"#FF7A00", color:"#fff", border:"none",
              borderRadius:"8px", cursor:"pointer", fontWeight:700, fontSize:"0.875rem" }}>
            Crear
          </button>
        </div>
      )}

      {/* Legend */}
      <div style={{ display:"flex", gap:"0.75rem", flexWrap:"wrap" }}>
        {[["🏢","Departamento","#3B82F6"],["📂","Categoría","#8B5CF6"],["📁","Subcategoría","#06B6D4"],["📌","Nodo","#F59E0B"],["📦","Producto","#6BB87A"]].map(([icon,label,color])=>(
          <span key={label as string} style={{ display:"flex", alignItems:"center", gap:"0.3rem",
            padding:"2px 8px", borderRadius:"20px", fontSize:"0.72rem", fontWeight:600,
            background:`${color}18`, color:color as string }}>
            {icon} {label}
          </span>
        ))}
        <span style={{ marginLeft:"auto", fontSize:"0.75rem", color:"#9CA3AF" }}>
          Doble click para editar · Hover para acciones
        </span>
      </div>

      {/* Tree */}
      <div style={{ background:"#fff", borderRadius:"14px", overflow:"hidden",
        boxShadow:"0 1px 4px rgba(0,0,0,0.06)", border:"1px solid #F3F4F6" }}>

        {loading ? (
          <div style={{ padding:"4rem", textAlign:"center" }}>
            <div style={{ display:"inline-flex", flexDirection:"column", alignItems:"center", gap:"1rem" }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{ height:"44px", background:"#F3F4F6", borderRadius:"8px",
                  width:`${320 - i*30}px`, animation:"pulse 1.5s ease-in-out infinite" }} />
              ))}
            </div>
            <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
          </div>
        ) : error ? (
          <div style={{ padding:"3rem", textAlign:"center" }}>
            <div style={{ fontSize:"2rem" }}>⚠️</div>
            <div style={{ color:"#dc2626", fontWeight:600, marginTop:"0.5rem" }}>{error}</div>
            <button onClick={()=>refetch()} style={{ marginTop:"1rem", padding:"0.5rem 1.25rem",
              background:"#FF7A00", color:"#fff", border:"none", borderRadius:"8px", cursor:"pointer", fontWeight:600 }}>
              Reintentar
            </button>
          </div>
        ) : visible.length === 0 ? (
          <div style={{ padding:"4rem", textAlign:"center" }}>
            <div style={{ fontSize:"3rem", marginBottom:"0.75rem" }}>{search ? "🔍" : "🌱"}</div>
            <div style={{ fontWeight:700, color:"#374151", fontSize:"1rem" }}>
              {search ? `Sin resultados para "${search}"` : "Catálogo vacío"}
            </div>
            <div style={{ color:"#9CA3AF", fontSize:"0.85rem", marginTop:"0.25rem" }}>
              {search ? "Probá con otro término" : "Creá el primer departamento para empezar"}
            </div>
          </div>
        ) : (
          <CatalogTree nodes={visible} isAdmin={!!isAdmin}
            onAdd={handleAdd} onEdit={handleEdit}
            onDelete={handleDelete} onToggle={handleToggle} />
        )}
      </div>
    </div>
  );
}
