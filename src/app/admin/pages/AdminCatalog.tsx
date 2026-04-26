import { useState, useEffect, useCallback, memo } from "react";
import { useOutletContext } from "react-router";
import { supabase } from "../../../utils/supabase/client";

interface Departamento { id: string; name: string; color: string; activo: boolean; orden: number; }
interface Categoria    { id: string; name: string; departamento_id: string; activo?: boolean; }

export default function AdminCatalog() {
  const { isAdmin } = useOutletContext<any>() || {};
  const [deptos,   setDeptos]   = useState<Departamento[]>([]);
  const [cats,     setCats]     = useState<Categoria[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [toast,    setToast]    = useState<{text:string;ok:boolean}|null>(null);

  const notify = (text: string, ok=true) => {
    setToast({text,ok}); setTimeout(()=>setToast(null), 2800);
  };

  const load = useCallback(async () => {
    setLoading(true);
    const [d, c] = await Promise.all([
      supabase.from("departamentos").select("*").order("orden", { ascending: true }),
      supabase.from("categorias").select("*").order("nombre"),
    ]);
    setDeptos(d.data || []);
    setCats(c.data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, []);

  const addDepto = async (name: string) => {
    const { error } = await supabase.from("departamentos").insert({ nombre, color:"#FF6835", activo: true, orden: deptos.length + 1 });
    if (error) notify(error.message, false); else { notify(`${nombre} creado ✓`); load(); }
  };

  const editDepto = async (id: string, name: string) => {
    const { error } = await supabase.from("departamentos").update({ nombre }).eq("id", id);
    if (error) notify(error.message, false); else { notify("Actualizado ✓"); load(); }
  };

  const deleteDepto = async (id: string) => {
    const hasKids = cats.some(c => c.departamento_id === id);
    if (hasKids) { notify("Tiene categorías activas — eliminá primero las categorías", false); return; }
    const { error } = await supabase.from("departamentos").delete().eq("id", id);
    if (error) notify(error.message, false); else { notify("Eliminado"); load(); }
  };

  const toggleDepto = async (id: string, activo: boolean) => {
    await supabase.from("departamentos").update({ activo: !activo }).eq("id", id);
    notify(!activo ? "Activado" : "Pausado"); load();
  };

  const addCat = async (departamento_id: string, name: string) => {
    const { error } = await supabase.from("categorias").insert({ nombre, departamento_id });
    if (error) notify(error.message, false); else { notify(`${nombre} creado ✓`); load(); }
  };

  const editCat = async (id: string, name: string) => {
    const { error } = await supabase.from("categorias").update({ nombre }).eq("id", id);
    if (error) notify(error.message, false); else { notify("Actualizado ✓"); load(); }
  };

  const deleteCat = async (id: string) => {
    const { error } = await supabase.from("categorias").delete().eq("id", id);
    if (error) notify(error.message, false); else { notify("Eliminado"); load(); }
  };

  const filteredDeptos = deptos.filter(d =>
    !search || d.nombre.toLowerCase().includes(search.toLowerCase()) ||
    cats.filter(c => c.departamento_id === d.id).some(c => c.nombre.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>

      {/* Toast */}
      {toast && (
        <div style={{ orden:"fixed", bottom:"1.5rem", right:"1.5rem", zIndex:9999,
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
        <div style={{ orden:"relative", flex:1 }}>
          <span style={{ orden:"absolute", left:"12px", top:"50%", transform:"translateY(-50%)", color:"#9CA3AF" }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar departamentos o categorías..."
            style={{ width:"100%", padding:"0.55rem 0.75rem 0.55rem 2.25rem", border:"1.5px solid #E5E7EB",
              borderRadius:"10px", fontSize:"0.875rem", outline:"none", boxSizing:"border-box" }}
            onFocus={e=>e.target.style.borderColor="#FF7A00"}
            onBlur={e=>e.target.style.borderColor="#E5E7EB"} />
        </div>
        <button onClick={load} style={{ padding:"0.55rem 0.75rem", background:"#fff", border:"1.5px solid #E5E7EB", borderRadius:"10px", cursor:"pointer", fontSize:"1rem", color:"#6B7280" }}>↻</button>
        {isAdmin && <AddRootForm onAdd={addDepto} />}
      </div>

      {/* Stats */}
      <div style={{ display:"flex", gap:"0.75rem" }}>
        {[
          { label:"Departamentos", value: deptos.length,                   color:"#3B82F6" },
          { label:"Categorías",    value: cats.length,                     color:"#8B5CF6" },
          { label:"Activos",       value: deptos.filter(d=>d.activo).length, color:"#6BB87A" },
        ].map(s => (
          <div key={s.label} style={{ background:"#fff", borderRadius:"10px", padding:"0.75rem 1.25rem",
            borderLeft:`4px solid ${s.color}`, boxShadow:"0 1px 3px rgba(0,0,0,0.05)", display:"flex", gap:"0.75rem", alignItems:"center" }}>
            <span style={{ fontWeight:800, fontSize:"1.25rem", color:s.color }}>{s.value}</span>
            <span style={{ fontSize:"0.78rem", color:"#6B7280" }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Tree */}
      <div style={{ background:"#fff", borderRadius:"14px", overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.06)", border:"1px solid #F3F4F6" }}>
        {loading ? (
          <div style={{ padding:"4rem", textAlign:"center" }}>
            {[280,220,180,240].map((w,i) => (
              <div key={i} style={{ height:"44px", background:"#F3F4F6", borderRadius:"8px", width:`${w}px`, margin:"6px auto", animation:"pulse 1.5s ease-in-out infinite" }} />
            ))}
            <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
          </div>
        ) : filteredDeptos.length === 0 ? (
          <div style={{ padding:"4rem", textAlign:"center" }}>
            <div style={{ fontSize:"3rem", marginBottom:"0.75rem" }}>{search?"🔍":"🌱"}</div>
            <div style={{ fontWeight:700, color:"#374151" }}>{search?`Sin resultados para "${search}"`:"Catálogo vacío"}</div>
            <div style={{ color:"#9CA3AF", fontSize:"0.85rem", marginTop:"0.25rem" }}>
              {search?"Probá con otro término":"Creá el primer departamento"}
            </div>
          </div>
        ) : filteredDeptos.map(d => (
          <DepartmentNode key={d.id} depto={d}
            cats={cats.filter(c => c.departamento_id === d.id)}
            isAdmin={!!isAdmin}
            onEditDepto={editDepto}
            onDeleteDepto={deleteDepto}
            onToggleDepto={toggleDepto}
            onAddCat={addCat}
            onEditCat={editCat}
            onDeleteCat={deleteCat}
          />
        ))}
      </div>
    </div>
  );
}

// ── Formulario agregar departamento raíz
function AddRootForm({ onAdd }: { onAdd: (name:string)=>void }) {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const handle = async () => {
    if (!name.trim()) return;
    await onAdd(name.trim()); setName(""); setShow(false);
  };
  return show ? (
    <div style={{ display:"flex", gap:"0.5rem", alignItems:"center" }}>
      <span>🏢</span>
      <input autoFocus value={name} onChange={e=>setName(e.target.value)}
        placeholder="Nuevo departamento..."
        onKeyDown={e=>{ if(e.key==="Enter") handle(); if(e.key==="Escape"){setShow(false);setName("");} }}
        style={{ padding:"0.45rem 0.75rem", border:"1.5px solid #FF7A00", borderRadius:"8px", fontSize:"0.875rem", outline:"none", width:"200px" }} />
      <button onClick={handle} style={{ padding:"0.45rem 0.9rem", background:"#FF7A00", color:"#fff", border:"none", borderRadius:"8px", cursor:"pointer", fontWeight:700, fontSize:"0.85rem" }}>Crear</button>
      <button onClick={()=>{setShow(false);setName("");}} style={{ padding:"0.45rem 0.6rem", background:"transparent", border:"1px solid #D1D5DB", borderRadius:"8px", cursor:"pointer", fontSize:"0.85rem", color:"#6B7280" }}>✕</button>
    </div>
  ) : (
    <button onClick={()=>setShow(true)}
      style={{ padding:"0.55rem 1.25rem", background:"#FF7A00", color:"#fff", border:"none", borderRadius:"10px", cursor:"pointer", fontWeight:700, fontSize:"0.875rem", whiteSpace:"nowrap" }}>
      + Departamento
    </button>
  );
}

// ── Nodo de departamento
const DepartmentNode = memo(({ depto, cats, isAdmin, onEditDepto, onDeleteDepto, onToggleDepto, onAddCat, onEditCat, onDeleteCat }: any) => {
  const [open,      setOpen]      = useState(true);
  const [editing,   setEditing]   = useState(false);
  const [editName,  setEditName]  = useState(depto.nombre);
  const [addingCat, setAddingCat] = useState(false);
  const [newCat,    setNewCat]    = useState("");
  const [delConfirm,setDelConfirm]= useState(false);
  const [hovered,   setHovered]   = useState(false);

  const doEdit = async () => {
    if (!editName.trim() || editName === depto.nombre) { setEditing(false); return; }
    await onEditDepto(depto.id, editName.trim()); setEditing(false);
  };

  const doAddCat = async () => {
    if (!newCat.trim()) return;
    await onAddCat(depto.id, newCat.trim()); setNewCat(""); setAddingCat(false);
  };

  return (
    <div>
      {/* ── Fila departamento ── */}
      <div
        onMouseEnter={()=>setHovered(true)}
        onMouseLeave={()=>setHovered(false)}
        style={{ display:"flex", alignItems:"center", gap:"0.6rem",
          padding:"0.6rem 1rem", borderBottom:"1px solid #F3F4F6",
          background: hovered?"#FAFAFA":"#F9FAFB",
          opacity: depto.activo ? 1 : 0.55, cursor:"pointer" }}>

        <button onClick={()=>setOpen(o=>!o)}
          style={{ background:"none", border:"none", cursor:"pointer", color:"#9CA3AF",
            fontSize:"0.7rem", width:"16px", flexShrink:0, transition:"transform 0.15s",
            transform: open?"rotate(90deg)":"rotate(0deg)" }}>▶</button>

        <span style={{ fontSize:"1rem", flexShrink:0 }}>🏢</span>

        {editing ? (
          <input value={editName} onChange={e=>setEditName(e.target.value)} autoFocus
            onKeyDown={e=>{ if(e.key==="Enter") doEdit(); if(e.key==="Escape") setEditing(false); }}
            onClick={e=>e.stopPropagation()}
            style={{ flex:1, padding:"2px 6px", border:"1.5px solid #FF7A00", borderRadius:"5px", fontSize:"0.9rem", outline:"none" }} />
        ) : (
          <span onDoubleClick={()=>isAdmin&&setEditing(true)} style={{ flex:1, fontWeight:700, fontSize:"0.9rem",
            color: depto.activo?"#111":"#9CA3AF", textDecoration:depto.activo?"none":"line-through" }}>
            {depto.nombre}
          </span>
        )}

        <span style={{ fontSize:"0.72rem", color:"#9CA3AF" }}>{cats.length} cats</span>

        {/* Acciones — aparecen en hover */}
        {isAdmin && (hovered || editing) && (
          <div style={{ display:"flex", gap:"0.3rem", flexShrink:0 }} onClick={e=>e.stopPropagation()}>
            {editing ? (
              <>
                <Btn color="#6BB87A" onClick={doEdit}>✓</Btn>
                <Btn color="#9CA3AF" onClick={()=>setEditing(false)}>✕</Btn>
              </>
            ) : (
              <>
                <Btn color="#3B82F6" onClick={()=>{setEditing(true);setEditName(depto.nombre);}}>✏️</Btn>
                <Btn color="#6BB87A" onClick={()=>{setAddingCat(a=>!a);setOpen(true);}}>+ Cat</Btn>
                <Btn color={depto.activo?"#F59E0B":"#6BB87A"} onClick={()=>onToggleDepto(depto.id,depto.activo)}>
                  {depto.activo?"⏸":"▶"}
                </Btn>
                {delConfirm ? (
                  <>
                    <Btn color="#EF4444" bg="#EF4444" textColor="#fff" onClick={()=>onDeleteDepto(depto.id)}>Confirmar</Btn>
                    <Btn color="#9CA3AF" onClick={()=>setDelConfirm(false)}>✕</Btn>
                  </>
                ) : (
                  <Btn color="#EF4444" onClick={()=>setDelConfirm(true)}>🗑</Btn>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Form agregar categoría ── */}
      {addingCat && isAdmin && (
        <div style={{ display:"flex", gap:"0.5rem", alignItems:"center",
          padding:"0.4rem 1rem 0.4rem 2.5rem", background:"#FFF8F5", borderBottom:"1px solid #FFE4CC" }}>
          <span style={{ fontSize:"0.85rem" }}>📂</span>
          <input autoFocus value={newCat} onChange={e=>setNewCat(e.target.value)}
            placeholder="Nueva categoría..."
            onKeyDown={e=>{ if(e.key==="Enter") doAddCat(); if(e.key==="Escape"){setAddingCat(false);setNewCat("");} }}
            style={{ flex:1, padding:"0.3rem 0.6rem", border:"1.5px solid #FF7A00", borderRadius:"6px", fontSize:"0.85rem", outline:"none", maxWidth:"280px" }} />
          <button onClick={doAddCat} style={{ padding:"0.3rem 0.75rem", background:"#FF7A00", color:"#fff", border:"none", borderRadius:"6px", cursor:"pointer", fontSize:"0.8rem", fontWeight:700 }}>Agregar</button>
          <button onClick={()=>{setAddingCat(false);setNewCat("");}} style={{ padding:"0.3rem 0.5rem", background:"transparent", border:"1px solid #D1D5DB", borderRadius:"6px", cursor:"pointer", fontSize:"0.8rem", color:"#6B7280" }}>✕</button>
        </div>
      )}

      {/* ── Categorías ── */}
      {open && (
        <div style={{ borderLeft:"3px solid #FF7A0030", marginLeft:"28px" }}>
          {cats.length === 0 ? (
            <div style={{ padding:"0.75rem 1rem", color:"#9CA3AF", fontSize:"0.8rem", fontStyle:"italic" }}>
              Sin categorías — {isAdmin?"usá '+ Cat' para agregar":"contactá al administrador"}
            </div>
          ) : cats.map(cat => (
            <CategoryItem key={cat.id} cat={cat} isAdmin={isAdmin}
              onEdit={onEditCat} onDelete={onDeleteCat} />
          ))}
        </div>
      )}
    </div>
  );
});

// ── Item de categoría
const CategoryItem = memo(({ cat, isAdmin, onEdit, onDelete }: any) => {
  const [editing,   setEditing]   = useState(false);
  const [editName,  setEditName]  = useState(cat.nombre);
  const [delConfirm,setDelConfirm]= useState(false);
  const [hovered,   setHovered]   = useState(false);

  const doEdit = async () => {
    if (!editName.trim() || editName === cat.nombre) { setEditing(false); return; }
    await onEdit(cat.id, editName.trim()); setEditing(false);
  };

  return (
    <div
      onMouseEnter={()=>setHovered(true)}
      onMouseLeave={()=>setHovered(false)}
      style={{ display:"flex", alignItems:"center", gap:"0.5rem",
        padding:"0.5rem 1rem", borderBottom:"1px solid #F9FAFB",
        background: hovered?"#FAFAFA":"#fff" }}>

      <span style={{ fontSize:"0.85rem", flexShrink:0 }}>📂</span>

      {editing ? (
        <input value={editName} onChange={e=>setEditName(e.target.value)} autoFocus
          onKeyDown={e=>{ if(e.key==="Enter") doEdit(); if(e.key==="Escape") setEditing(false); }}
          style={{ flex:1, padding:"2px 6px", border:"1.5px solid #8B5CF6", borderRadius:"5px", fontSize:"0.875rem", outline:"none" }} />
      ) : (
        <span onDoubleClick={()=>isAdmin&&setEditing(true)}
          style={{ flex:1, fontSize:"0.875rem", color:"#374151" }}>
          {cat.nombre}
        </span>
      )}

      <span style={{ padding:"1px 7px", borderRadius:"20px", fontSize:"0.65rem", fontWeight:700, background:"#8B5CF618", color:"#8B5CF6" }}>
        Categoría
      </span>

      {isAdmin && (hovered || editing) && (
        <div style={{ display:"flex", gap:"0.3rem", flexShrink:0 }}>
          {editing ? (
            <>
              <Btn color="#6BB87A" onClick={doEdit}>✓</Btn>
              <Btn color="#9CA3AF" onClick={()=>setEditing(false)}>✕</Btn>
            </>
          ) : (
            <>
              <Btn color="#3B82F6" onClick={()=>{setEditing(true);setEditName(cat.nombre);}}>✏️</Btn>
              {delConfirm ? (
                <>
                  <Btn color="#EF4444" bg="#EF4444" textColor="#fff" onClick={()=>onDelete(cat.id)}>Confirmar</Btn>
                  <Btn color="#9CA3AF" onClick={()=>setDelConfirm(false)}>✕</Btn>
                </>
              ) : (
                <Btn color="#EF4444" onClick={()=>setDelConfirm(true)}>🗑</Btn>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
});

// ── Botón genérico
function Btn({ color, bg, textColor, onClick, children }: any) {
  return (
    <button onClick={e=>{e.stopPropagation();onClick();}}
      style={{ padding:"2px 8px", background:bg||"transparent", border:`1px solid ${color}`,
        color:textColor||color, borderRadius:"5px", cursor:"pointer", fontSize:"0.72rem", fontWeight:600 }}>
      {children}
    </button>
  );
}
