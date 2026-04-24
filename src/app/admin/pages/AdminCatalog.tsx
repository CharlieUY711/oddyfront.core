import { useState, useCallback } from "react";
import { useOutletContext } from "react-router";
import { useDepartments, useCategories, useSubcategories } from "../hooks/useCatalog";
import { catalogService, toSlug } from "../services/catalogService";

type Tab = "tree" | "departments" | "categories" | "subcategories";

export default function AdminCatalog() {
  const { isAdmin } = useOutletContext<any>() || {};
  const [tab, setTab] = useState<Tab>("tree");
  const [toast, setToast] = useState<{text:string;type:"ok"|"err"}|null>(null);

  const depts = useDepartments();
  const cats  = useCategories();
  const subs  = useSubcategories();

  const notify = useCallback((text: string, type: "ok"|"err") => {
    setToast({text,type});
    setTimeout(() => setToast(null), 3000);
  }, []);

  const refetchAll = () => { depts.refetch(); cats.refetch(); subs.refetch(); };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <button onClick={refetchAll} style={{ padding:"0.4rem 0.9rem", background:"#fff", border:"1px solid #E5E7EB", borderRadius:"8px", cursor:"pointer", fontSize:"0.8rem" }}>🔄</button>
      </div>

      {toast && (
        <div style={{ padding:"0.75rem 1rem", borderRadius:"8px", fontSize:"0.85rem", fontWeight:600,
          background: toast.type==="ok" ? "#f0fdf4" : "#fef2f2",
          color: toast.type==="ok" ? "#166534" : "#dc2626",
          border:`1px solid ${toast.type==="ok" ? "#6BB87A" : "#ef4444"}` }}>
          {toast.type==="ok" ? "✅" : "❌"} {toast.text}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display:"flex", gap:0, background:"#fff", borderRadius:"10px", padding:"4px", width:"fit-content", boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>
        {([["tree","🌳 Árbol"],["departments","🏢 Deptos"],["categories","📂 Cats"],["subcategories","📁 Subcats"]] as [Tab,string][]).map(([t,l]) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding:"0.45rem 1.1rem", borderRadius:"7px", border:"none", cursor:"pointer",
            fontWeight: tab===t ? 700 : 400, fontSize:"0.85rem",
            background: tab===t ? "#FF6835" : "transparent",
            color: tab===t ? "#fff" : "#666", transition:"all 0.15s",
          }}>{l}</button>
        ))}
      </div>

      {tab==="tree" && (
        <TreeView depts={depts.data} cats={cats.data} subs={subs.data}
          loading={depts.loading} notify={notify} refetchAll={refetchAll} />
      )}
      {tab==="departments" && (
        <CatalogSection title="Departamentos" items={depts.data} loading={depts.loading}
          columns={["Nombre","Slug","Categorías","Estado"]}
          renderRow={d=>[d.name,d.slug,d.categories_count,d.is_active?"✅":"⏸"]}
          onCreate={async(name)=>{ const {error}=await catalogService.createDepartment(name,toSlug(name)); error?notify(error.message,"err"):(notify("Creado ✓","ok"),depts.refetch()); }}
          onToggle={async(item)=>{ await catalogService.updateDepartment(item.id,{p_is_active:!item.is_active}); notify(`${item.name} actualizado`,"ok"); depts.refetch(); }}
          onDelete={async(item)=>{ const {error}=await catalogService.deleteDepartment(item.id); error?notify(error.message,"err"):(notify("Eliminado","ok"),depts.refetch()); }}
        />
      )}
      {tab==="categories" && (
        <CatalogSection title="Categorías" items={cats.data} loading={cats.loading}
          columns={["Nombre","Slug","Departamento","Subcats","Estado"]}
          renderRow={c=>[c.name,c.slug,c.department_name,c.subcategories_count,c.is_active?"✅":"⏸"]}
          parentLabel="Departamento" parentOptions={depts.data.map(d=>({id:d.id,name:d.name}))}
          onCreate={async(name,pid)=>{ if(!pid){notify("Seleccioná departamento","err");return;} const {error}=await catalogService.createCategory(pid,name,toSlug(name)); error?notify(error.message,"err"):(notify("Creada ✓","ok"),cats.refetch()); }}
          onToggle={async(item)=>{ await catalogService.updateCategory(item.id,{p_is_active:!item.is_active}); notify("Actualizada","ok"); cats.refetch(); }}
          onDelete={async(item)=>{ const {error}=await catalogService.deleteCategory(item.id); error?notify(error.message,"err"):(notify("Eliminada","ok"),cats.refetch()); }}
        />
      )}
      {tab==="subcategories" && (
        <CatalogSection title="Subcategorías" items={subs.data} loading={subs.loading}
          columns={["Nombre","Categoría","Departamento","Estado"]}
          renderRow={s=>[s.name,s.category_name,s.department_name,s.is_active?"✅":"⏸"]}
          parentLabel="Categoría" parentOptions={cats.data.map(c=>({id:c.id,name:`${c.department_name} → ${c.name}`}))}
          onCreate={async(name,pid)=>{ if(!pid){notify("Seleccioná categoría","err");return;} const {error}=await catalogService.createSubcategory(pid,name,toSlug(name)); error?notify(error.message,"err"):(notify("Creada ✓","ok"),subs.refetch()); }}
          onToggle={async(item)=>{ await catalogService.updateSubcategory(item.id,{p_is_active:!item.is_active}); notify("Actualizada","ok"); subs.refetch(); }}
          onDelete={async(item)=>{ const {error}=await catalogService.deleteSubcategory(item.id); error?notify(error.message,"err"):(notify("Eliminada","ok"),subs.refetch()); }}
        />
      )}
    </div>
  );
}

// ── Vista árbol jerárquica
function TreeView({ depts, cats, subs, loading, notify, refetchAll }: any) {
  const [expanded,    setExpanded]    = useState<Set<string>>(new Set());
  const [expandedCat, setExpandedCat] = useState<Set<string>>(new Set());
  const [addingTo,    setAddingTo]    = useState<{type:"cat"|"sub";parentId:string}|null>(null);
  const [newName,     setNewName]     = useState("");
  const [editId,      setEditId]      = useState<string|null>(null);
  const [editName,    setEditName]    = useState("");
  const [saving,      setSaving]      = useState(false);
  const [delConfirm,  setDelConfirm]  = useState<string|null>(null);

  const toggle = (id:string) => setExpanded(p=>{ const n=new Set(p); n.has(id)?n.delete(id):n.add(id); return n; });
  const toggleCat = (id:string) => setExpandedCat(p=>{ const n=new Set(p); n.has(id)?n.delete(id):n.add(id); return n; });

  const handleAdd = async () => {
    if(!newName.trim()||!addingTo) return;
    setSaving(true);
    if(addingTo.type==="cat") {
      const {error}=await catalogService.createCategory(addingTo.parentId,newName.trim(),toSlug(newName));
      error?notify(error.message,"err"):(notify("Categoría creada ✓","ok"),refetchAll());
    } else {
      const {error}=await catalogService.createSubcategory(addingTo.parentId,newName.trim(),toSlug(newName));
      error?notify(error.message,"err"):(notify("Subcategoría creada ✓","ok"),refetchAll());
    }
    setNewName(""); setAddingTo(null); setSaving(false);
  };

  const handleEdit = async (type:"dept"|"cat"|"sub", id:string) => {
    if(!editName.trim()) return;
    setSaving(true);
    if(type==="dept") await catalogService.updateDepartment(id,{p_name:editName.trim()});
    else if(type==="cat") await catalogService.updateCategory(id,{p_name:editName.trim()});
    else await catalogService.updateSubcategory(id,{p_name:editName.trim()});
    notify("Actualizado ✓","ok"); setEditId(null); setEditName(""); refetchAll(); setSaving(false);
  };

  const handleDelete = async (type:"dept"|"cat"|"sub", id:string) => {
    let error: any;
    if(type==="dept") ({error}=await catalogService.deleteDepartment(id));
    else if(type==="cat") ({error}=await catalogService.deleteCategory(id));
    else ({error}=await catalogService.deleteSubcategory(id));
    error?notify(error.message,"err"):(notify("Eliminado","ok"),refetchAll());
    setDelConfirm(null);
  };

  if(loading) return <div style={{color:"#888",padding:"2rem"}}>Cargando...</div>;

  const btnStyle = (color:string): React.CSSProperties => ({
    padding:"2px 8px", background:"transparent", border:`1px solid ${color}`,
    color, borderRadius:"5px", cursor:"pointer", fontSize:"0.72rem", fontWeight:600,
  });

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"0.5rem" }}>
      {/* Add Departamento */}
      <div style={{ background:"#fff", borderRadius:"10px", padding:"0.75rem 1rem", display:"flex", gap:"0.5rem" }}>
        <input placeholder="Nuevo departamento..." value={addingTo?.type==="dept"?newName:""} 
          onChange={e=>{ setAddingTo({type:"cat",parentId:"dept"}); setNewName(e.target.value); }}
          onFocus={()=>setAddingTo({type:"cat",parentId:"dept"})}
          style={{ flex:1, padding:"0.4rem 0.75rem", border:"1px solid #E5E7EB", borderRadius:"6px", fontSize:"0.85rem" }} />
        <button onClick={async()=>{
          if(!newName.trim()) return;
          const {error}=await catalogService.createDepartment(newName.trim(),toSlug(newName));
          error?notify(error.message,"err"):(notify("Departamento creado ✓","ok"),refetchAll(),setNewName(""),setAddingTo(null));
        }} style={{ padding:"0.4rem 0.9rem", background:"#FF6835", color:"#fff", border:"none", borderRadius:"6px", cursor:"pointer", fontWeight:700, fontSize:"0.85rem" }}>
          + Depto
        </button>
      </div>

      {depts.map((d:any) => {
        const dCats = cats.filter((c:any)=>c.department_id===d.id);
        const isOpen = expanded.has(d.id);
        return (
          <div key={d.id} style={{ background:"#fff", borderRadius:"12px", overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
            {/* Departamento row */}
            <div style={{ display:"flex", alignItems:"center", padding:"0.75rem 1rem", borderBottom: isOpen?"1px solid #F3F4F6":"none", background:"#F9FAFB", gap:"0.75rem" }}>
              <button onClick={()=>toggle(d.id)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:"1rem", width:"20px" }}>
                {isOpen?"▼":"▶"}
              </button>
              <span style={{ fontSize:"1rem" }}>🏢</span>
              {editId===d.id ? (
                <input value={editName} onChange={e=>setEditName(e.target.value)} autoFocus
                  onKeyDown={e=>{ if(e.key==="Enter") handleEdit("dept",d.id); if(e.key==="Escape") setEditId(null); }}
                  style={{ flex:1, padding:"3px 8px", border:"1px solid #FF6835", borderRadius:"5px", fontSize:"0.9rem" }} />
              ) : (
                <span style={{ flex:1, fontWeight:700, fontSize:"0.95rem", color: d.is_active?"#111":"#9CA3AF", textDecoration:d.is_active?"none":"line-through" }}>
                  {d.name} <span style={{fontWeight:400,color:"#9CA3AF",fontSize:"0.75rem"}}>({dCats.length} cats)</span>
                </span>
              )}
              <div style={{ display:"flex", gap:"0.35rem" }}>
                {editId===d.id ? (
                  <>
                    <button onClick={()=>handleEdit("dept",d.id)} disabled={saving} style={btnStyle("#6BB87A")}>✓</button>
                    <button onClick={()=>setEditId(null)} style={btnStyle("#9CA3AF")}>✕</button>
                  </>
                ) : (
                  <>
                    <button onClick={()=>{ setEditId(d.id); setEditName(d.name); }} style={btnStyle("#3B82F6")}>✏️</button>
                    <button onClick={()=>setAddingTo({type:"cat",parentId:d.id})} style={btnStyle("#6BB87A")}>+ Cat</button>
                    {delConfirm===d.id ? (
                      <>
                        <button onClick={()=>handleDelete("dept",d.id)} style={{...btnStyle("#EF4444"),background:"#EF4444",color:"#fff"}}>Confirmar</button>
                        <button onClick={()=>setDelConfirm(null)} style={btnStyle("#9CA3AF")}>✕</button>
                      </>
                    ) : (
                      <button onClick={()=>setDelConfirm(d.id)} style={btnStyle("#EF4444")}>🗑</button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Add Cat form */}
            {addingTo?.parentId===d.id && addingTo?.type==="cat" && (
              <div style={{ display:"flex", gap:"0.5rem", padding:"0.5rem 1rem 0.5rem 2.75rem", background:"#FFF3EF", borderBottom:"1px solid #FFE0D0" }}>
                <input autoFocus placeholder="Nueva categoría..." value={newName} onChange={e=>setNewName(e.target.value)}
                  onKeyDown={e=>{ if(e.key==="Enter") handleAdd(); if(e.key==="Escape"){setAddingTo(null);setNewName("");} }}
                  style={{ flex:1, padding:"0.35rem 0.6rem", border:"1px solid #FF6835", borderRadius:"5px", fontSize:"0.85rem" }} />
                <button onClick={handleAdd} disabled={saving} style={{ padding:"0.35rem 0.75rem", background:"#FF6835", color:"#fff", border:"none", borderRadius:"5px", cursor:"pointer", fontSize:"0.8rem", fontWeight:700 }}>Agregar</button>
                <button onClick={()=>{setAddingTo(null);setNewName("");}} style={{ padding:"0.35rem 0.5rem", background:"transparent", border:"1px solid #ccc", borderRadius:"5px", cursor:"pointer", fontSize:"0.8rem" }}>✕</button>
              </div>
            )}

            {/* Categorías */}
            {isOpen && dCats.map((c:any) => {
              const cSubs = subs.filter((s:any)=>s.category_id===c.id);
              const catOpen = expandedCat.has(c.id);
              return (
                <div key={c.id}>
                  <div style={{ display:"flex", alignItems:"center", padding:"0.6rem 1rem 0.6rem 2.5rem", borderBottom:"1px solid #F9FAFB", gap:"0.6rem", background:"#fff" }}>
                    <button onClick={()=>toggleCat(c.id)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:"0.85rem", width:"16px" }}>
                      {catOpen?"▼":"▶"}
                    </button>
                    <span style={{ fontSize:"0.9rem" }}>📂</span>
                    {editId===c.id ? (
                      <input value={editName} onChange={e=>setEditName(e.target.value)} autoFocus
                        onKeyDown={e=>{ if(e.key==="Enter") handleEdit("cat",c.id); if(e.key==="Escape") setEditId(null); }}
                        style={{ flex:1, padding:"2px 6px", border:"1px solid #3B82F6", borderRadius:"4px", fontSize:"0.85rem" }} />
                    ) : (
                      <span style={{ flex:1, fontSize:"0.875rem", color:c.is_active?"#374151":"#9CA3AF", textDecoration:c.is_active?"none":"line-through" }}>
                        {c.name} <span style={{color:"#9CA3AF",fontSize:"0.72rem"}}>({cSubs.length} subs)</span>
                      </span>
                    )}
                    <div style={{ display:"flex", gap:"0.3rem" }}>
                      {editId===c.id ? (
                        <>
                          <button onClick={()=>handleEdit("cat",c.id)} style={btnStyle("#6BB87A")}>✓</button>
                          <button onClick={()=>setEditId(null)} style={btnStyle("#9CA3AF")}>✕</button>
                        </>
                      ) : (
                        <>
                          <button onClick={()=>{ setEditId(c.id); setEditName(c.name); }} style={btnStyle("#3B82F6")}>✏️</button>
                          <button onClick={()=>setAddingTo({type:"sub",parentId:c.id})} style={btnStyle("#6BB87A")}>+ Sub</button>
                          {delConfirm===c.id ? (
                            <>
                              <button onClick={()=>handleDelete("cat",c.id)} style={{...btnStyle("#EF4444"),background:"#EF4444",color:"#fff"}}>Confirmar</button>
                              <button onClick={()=>setDelConfirm(null)} style={btnStyle("#9CA3AF")}>✕</button>
                            </>
                          ) : (
                            <button onClick={()=>setDelConfirm(c.id)} style={btnStyle("#EF4444")}>🗑</button>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Add Sub form */}
                  {addingTo?.parentId===c.id && addingTo?.type==="sub" && (
                    <div style={{ display:"flex", gap:"0.5rem", padding:"0.4rem 1rem 0.4rem 5rem", background:"#f0fdf4", borderBottom:"1px solid #d1fae5" }}>
                      <input autoFocus placeholder="Nueva subcategoría..." value={newName} onChange={e=>setNewName(e.target.value)}
                        onKeyDown={e=>{ if(e.key==="Enter") handleAdd(); if(e.key==="Escape"){setAddingTo(null);setNewName("");} }}
                        style={{ flex:1, padding:"0.3rem 0.6rem", border:"1px solid #6BB87A", borderRadius:"4px", fontSize:"0.8rem" }} />
                      <button onClick={handleAdd} disabled={saving} style={{ padding:"0.3rem 0.7rem", background:"#6BB87A", color:"#fff", border:"none", borderRadius:"4px", cursor:"pointer", fontSize:"0.78rem", fontWeight:700 }}>Agregar</button>
                      <button onClick={()=>{setAddingTo(null);setNewName("");}} style={{ padding:"0.3rem 0.5rem", background:"transparent", border:"1px solid #ccc", borderRadius:"4px", cursor:"pointer", fontSize:"0.78rem" }}>✕</button>
                    </div>
                  )}

                  {/* Subcategorías */}
                  {catOpen && cSubs.map((s:any) => (
                    <div key={s.id} style={{ display:"flex", alignItems:"center", padding:"0.5rem 1rem 0.5rem 5rem", borderBottom:"1px solid #F9FAFB", gap:"0.5rem", background:"#FAFAFA" }}>
                      <span style={{ fontSize:"0.8rem" }}>📁</span>
                      {editId===s.id ? (
                        <input value={editName} onChange={e=>setEditName(e.target.value)} autoFocus
                          onKeyDown={e=>{ if(e.key==="Enter") handleEdit("sub",s.id); if(e.key==="Escape") setEditId(null); }}
                          style={{ flex:1, padding:"2px 6px", border:"1px solid #8B5CF6", borderRadius:"4px", fontSize:"0.8rem" }} />
                      ) : (
                        <span style={{ flex:1, fontSize:"0.825rem", color:s.is_active?"#374151":"#9CA3AF", textDecoration:s.is_active?"none":"line-through" }}>
                          {s.name}
                        </span>
                      )}
                      <div style={{ display:"flex", gap:"0.3rem" }}>
                        {editId===s.id ? (
                          <>
                            <button onClick={()=>handleEdit("sub",s.id)} style={btnStyle("#6BB87A")}>✓</button>
                            <button onClick={()=>setEditId(null)} style={btnStyle("#9CA3AF")}>✕</button>
                          </>
                        ) : (
                          <>
                            <button onClick={()=>{ setEditId(s.id); setEditName(s.name); }} style={btnStyle("#3B82F6")}>✏️</button>
                            {delConfirm===s.id ? (
                              <>
                                <button onClick={()=>handleDelete("sub",s.id)} style={{...btnStyle("#EF4444"),background:"#EF4444",color:"#fff"}}>Confirmar</button>
                                <button onClick={()=>setDelConfirm(null)} style={btnStyle("#9CA3AF")}>✕</button>
                              </>
                            ) : (
                              <button onClick={()=>setDelConfirm(s.id)} style={btnStyle("#EF4444")}>🗑</button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// ── Tabla genérica
function CatalogSection({ title, items, loading, columns, renderRow, onCreate, onToggle, onDelete, parentLabel, parentOptions }: any) {
  const [search,   setSearch]   = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newName,  setNewName]  = useState("");
  const [parentId, setParentId] = useState("");
  const [delId,    setDelId]    = useState<string|null>(null);
  const [saving,   setSaving]   = useState(false);

  const filtered = items.filter((i:any)=>i.name.toLowerCase().includes(search.toLowerCase()));

  const handleCreate = async () => {
    if(!newName.trim()) return;
    setSaving(true);
    await onCreate(newName.trim(), parentId||undefined);
    setNewName(""); setParentId(""); setShowForm(false); setSaving(false);
  };

  if(loading) return <div style={{color:"#888",padding:"2rem"}}>Cargando...</div>;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
      <div style={{ display:"flex", gap:"0.75rem" }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={`Buscar...`}
          style={{ flex:1, padding:"0.5rem 0.75rem", border:"1px solid #E5E7EB", borderRadius:"8px", fontSize:"0.875rem" }} />
        <button onClick={()=>setShowForm(!showForm)}
          style={{ padding:"0.5rem 1.1rem", background:"#FF6835", color:"#fff", border:"none", borderRadius:"8px", cursor:"pointer", fontWeight:700 }}>
          {showForm?"Cancelar":"+ Nuevo"}
        </button>
      </div>

      {showForm && (
        <div style={{ background:"#fff", borderRadius:"10px", padding:"1rem", display:"flex", gap:"0.5rem", flexWrap:"wrap", border:"2px solid #FF6835" }}>
          {parentOptions && (
            <select value={parentId} onChange={e=>setParentId(e.target.value)}
              style={{ padding:"0.45rem 0.75rem", border:"1px solid #E5E7EB", borderRadius:"6px", fontSize:"0.85rem" }}>
              <option value="">Seleccioná {parentLabel}...</option>
              {parentOptions.map((o:any)=><option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          )}
          <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Nombre..."
            onKeyDown={e=>e.key==="Enter"&&handleCreate()}
            style={{ flex:1, minWidth:"160px", padding:"0.45rem 0.75rem", border:"1px solid #E5E7EB", borderRadius:"6px", fontSize:"0.85rem" }} />
          <button onClick={handleCreate} disabled={saving||!newName.trim()}
            style={{ padding:"0.45rem 1rem", background:saving?"#ccc":"#6BB87A", color:"#fff", border:"none", borderRadius:"6px", cursor:"pointer", fontWeight:700 }}>
            {saving?"...":"Crear"}
          </button>
        </div>
      )}

      <div style={{ background:"#fff", borderRadius:"12px", overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"#F9FAFB", borderBottom:"2px solid #E5E7EB" }}>
              {[...columns,""].map((h:string)=>(
                <th key={h} style={{ padding:"0.7rem 1rem", textAlign:"left", fontSize:"0.72rem", fontWeight:700, color:"#6B7280", textTransform:"uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length===0 && <tr><td colSpan={columns.length+1} style={{ padding:"3rem", textAlign:"center", color:"#9CA3AF" }}>Sin resultados</td></tr>}
            {filtered.map((item:any,idx:number)=>(
              <tr key={item.id} style={{ borderBottom:"1px solid #F3F4F6", background:idx%2===0?"#fff":"#FAFAFA" }}>
                {renderRow(item).map((cell:any,ci:number)=>(
                  <td key={ci} style={{ padding:"0.7rem 1rem", fontSize:"0.875rem", color:"#374151" }}>{cell}</td>
                ))}
                <td style={{ padding:"0.7rem 1rem" }}>
                  <div style={{ display:"flex", gap:"0.35rem" }}>
                    <button onClick={()=>onToggle(item)} style={{ padding:"3px 8px", background:"transparent", border:`1px solid ${item.is_active?"#F59E0B":"#6BB87A"}`, color:item.is_active?"#F59E0B":"#6BB87A", borderRadius:"5px", cursor:"pointer", fontSize:"0.72rem", fontWeight:600 }}>
                      {item.is_active?"Pausar":"Activar"}
                    </button>
                    {delId===item.id ? (
                      <>
                        <button onClick={async()=>{await onDelete(item);setDelId(null);}} style={{ padding:"3px 8px", background:"#EF4444", color:"#fff", border:"none", borderRadius:"5px", cursor:"pointer", fontSize:"0.72rem", fontWeight:700 }}>Confirmar</button>
                        <button onClick={()=>setDelId(null)} style={{ padding:"3px 6px", background:"#f1f5f9", border:"none", borderRadius:"5px", cursor:"pointer", fontSize:"0.72rem" }}>✕</button>
                      </>
                    ) : (
                      <button onClick={()=>setDelId(item.id)} style={{ padding:"3px 8px", background:"transparent", border:"1px solid #EF4444", color:"#EF4444", borderRadius:"5px", cursor:"pointer", fontSize:"0.72rem", fontWeight:600 }}>Eliminar</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
