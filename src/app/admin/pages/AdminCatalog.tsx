import { useState, useCallback } from "react";
import { useOutletContext } from "react-router";
import { useCatalogTree } from "../hooks/useCatalogTree";
import { useDepartments, useCategories, useSubcategories } from "../hooks/useCatalog";
import { catalogService, toSlug, NODE_ICONS } from "../services/catalogService";
import CatalogTree from "../components/CatalogTree";

type Tab = "tree" | "legacy";

export default function AdminCatalog() {
  const { isAdmin } = useOutletContext<any>() || {};
  const [tab,   setTab]   = useState<Tab>("tree");
  const [toast, setToast] = useState<{text:string;type:"ok"|"err"}|null>(null);

  const { tree, loading, error, refetch, createNode, updateNode, deleteNode, toggleActive } = useCatalogTree();
  const depts = useDepartments();
  const cats  = useCategories();
  const subs  = useSubcategories();

  const notify = useCallback((text:string, type:"ok"|"err") => {
    setToast({text,type}); setTimeout(()=>setToast(null),3000);
  }, []);

  const handleAdd = async (parentId: string, name: string, type: string) => {
    await createNode(parentId, name, type);
    notify(`${name} creado ✓`,"ok");
  };

  const handleAddRoot = async (name: string) => {
    await createNode(null, name, "department");
    notify(`Departamento ${name} creado ✓`,"ok");
  };

  const handleEdit = async (id: string, name: string) => {
    await updateNode(id, name);
    notify("Actualizado ✓","ok");
  };

  const handleDelete = async (id: string) => {
    await deleteNode(id);
    notify("Eliminado","ok");
  };

  const handleToggle = async (id: string, current: boolean) => {
    await toggleActive(id, current);
    notify(current ? "Pausado" : "Activado","ok");
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>

      {toast && (
        <div style={{ padding:"0.75rem 1rem", borderRadius:"8px", fontSize:"0.85rem", fontWeight:600,
          background: toast.type==="ok"?"#f0fdf4":"#fef2f2",
          color: toast.type==="ok"?"#166534":"#dc2626",
          border:`1px solid ${toast.type==="ok"?"#6BB87A":"#ef4444"}` }}>
          {toast.type==="ok"?"✅":"❌"} {toast.text}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display:"flex", gap:0, background:"#fff", borderRadius:"10px", padding:"4px", width:"fit-content", boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>
        {([["tree","🌳 Árbol jerárquico"],["legacy","📋 Tabla clásica"]] as [Tab,string][]).map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)} style={{
            padding:"0.45rem 1.1rem", borderRadius:"7px", border:"none", cursor:"pointer",
            fontWeight:tab===t?700:400, fontSize:"0.85rem",
            background:tab===t?"#FF7A00":"transparent",
            color:tab===t?"#fff":"#666", transition:"all 0.15s",
          }}>{l}</button>
        ))}
      </div>

      {tab==="tree" && (
        <div style={{ background:"#fff", borderRadius:"12px", overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
          {/* Header con agregar departamento raíz */}
          {isAdmin && (
            <AddRootForm onAdd={handleAddRoot} />
          )}

          {loading ? (
            <div style={{ padding:"3rem", textAlign:"center", color:"#888" }}>
              <div style={{ fontSize:"2rem", marginBottom:"0.5rem" }}>🌳</div>
              Cargando catálogo...
            </div>
          ) : error ? (
            <div style={{ padding:"2rem", color:"#dc2626", textAlign:"center" }}>❌ {error}</div>
          ) : tree.length === 0 ? (
            <div style={{ padding:"3rem", textAlign:"center", color:"#9CA3AF" }}>
              <div style={{ fontSize:"2rem", marginBottom:"0.5rem" }}>🌱</div>
              No hay nodos en el catálogo. Creá el primer departamento.
            </div>
          ) : (
            <CatalogTree nodes={tree} isAdmin={!!isAdmin}
              onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} onToggle={handleToggle} />
          )}
        </div>
      )}

      {tab==="legacy" && (
        <LegacyView depts={depts} cats={cats} subs={subs} notify={notify} isAdmin={!!isAdmin} />
      )}
    </div>
  );
}

function AddRootForm({ onAdd }: { onAdd: (name:string)=>void }) {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");

  const handle = async () => {
    if (!name.trim()) return;
    await onAdd(name.trim());
    setName(""); setShow(false);
  };

  return (
    <div style={{ padding:"0.75rem 1rem", borderBottom:"1px solid #F3F4F6", display:"flex", gap:"0.5rem", alignItems:"center", background:"#FAFAFA" }}>
      {show ? (
        <>
          <span>🏢</span>
          <input autoFocus value={name} onChange={e=>setName(e.target.value)} placeholder="Nombre del departamento..."
            onKeyDown={e=>{ if(e.key==="Enter") handle(); if(e.key==="Escape"){setShow(false);setName("");} }}
            style={{ flex:1, padding:"0.4rem 0.75rem", border:"1px solid #FF7A00", borderRadius:"6px", fontSize:"0.875rem", outline:"none" }} />
          <button onClick={handle} style={{ padding:"0.4rem 0.9rem", background:"#FF7A00", color:"#fff", border:"none", borderRadius:"6px", cursor:"pointer", fontWeight:700, fontSize:"0.85rem" }}>Crear</button>
          <button onClick={()=>{setShow(false);setName("");}} style={{ padding:"0.4rem 0.6rem", background:"transparent", border:"1px solid #ccc", borderRadius:"6px", cursor:"pointer", fontSize:"0.85rem" }}>✕</button>
        </>
      ) : (
        <button onClick={()=>setShow(true)}
          style={{ padding:"0.4rem 1rem", background:"transparent", border:"1px solid #FF7A00", color:"#FF7A00", borderRadius:"6px", cursor:"pointer", fontWeight:600, fontSize:"0.85rem" }}>
          + Nuevo departamento
        </button>
      )}
    </div>
  );
}

function LegacyView({ depts, cats, subs, notify, isAdmin }: any) {
  const [tab, setTab] = useState<"departments"|"categories"|"subcategories">("departments");

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
      <div style={{ display:"flex", gap:0, background:"#fff", borderRadius:"8px", padding:"3px", width:"fit-content" }}>
        {(["departments","categories","subcategories"] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{
            padding:"0.4rem 1rem", borderRadius:"6px", border:"none", cursor:"pointer",
            fontWeight:tab===t?700:400, fontSize:"0.8rem",
            background:tab===t?"#0F3460":"transparent",
            color:tab===t?"#fff":"#666",
          }}>
            {t==="departments"?"🏢 Deptos":t==="categories"?"📂 Cats":"📁 Subcats"}
          </button>
        ))}
      </div>

      {tab==="departments" && (
        <SimpleTable items={depts.data} loading={depts.loading}
          columns={["Nombre","Slug","Categorías"]}
          renderRow={(d:any)=>[d.name,d.slug,d.categories_count]}
          isAdmin={isAdmin}
          onCreate={async(name:string)=>{ const {error}=await catalogService.createDepartment(name,toSlug(name)); error?notify(error.message,"err"):(notify("Creado ✓","ok"),depts.refetch()); }}
          onDelete={async(item:any)=>{ const {error}=await catalogService.deleteDepartment(item.id); error?notify(error.message,"err"):(notify("Eliminado","ok"),depts.refetch()); }}
        />
      )}
      {tab==="categories" && (
        <SimpleTable items={cats.data} loading={cats.loading}
          columns={["Nombre","Departamento","Subcats"]}
          renderRow={(c:any)=>[c.name,c.department_name,c.subcategories_count]}
          isAdmin={isAdmin}
          parentLabel="Departamento" parentOptions={depts.data.map((d:any)=>({id:d.id,name:d.name}))}
          onCreate={async(name:string,pid:string)=>{ const {error}=await catalogService.createCategory(pid,name,toSlug(name)); error?notify(error.message,"err"):(notify("Creada ✓","ok"),cats.refetch()); }}
          onDelete={async(item:any)=>{ const {error}=await catalogService.deleteCategory(item.id); error?notify(error.message,"err"):(notify("Eliminada","ok"),cats.refetch()); }}
        />
      )}
      {tab==="subcategories" && (
        <SimpleTable items={subs.data} loading={subs.loading}
          columns={["Nombre","Categoría","Departamento"]}
          renderRow={(s:any)=>[s.name,s.category_name,s.department_name]}
          isAdmin={isAdmin}
          parentLabel="Categoría" parentOptions={cats.data.map((c:any)=>({id:c.id,name:`${c.department_name} → ${c.name}`}))}
          onCreate={async(name:string,pid:string)=>{ const {error}=await catalogService.createSubcategory(pid,name,toSlug(name)); error?notify(error.message,"err"):(notify("Creada ✓","ok"),subs.refetch()); }}
          onDelete={async(item:any)=>{ const {error}=await catalogService.deleteSubcategory(item.id); error?notify(error.message,"err"):(notify("Eliminada","ok"),subs.refetch()); }}
        />
      )}
    </div>
  );
}

function SimpleTable({ items, loading, columns, renderRow, onCreate, onDelete, isAdmin, parentLabel, parentOptions }: any) {
  const [showForm, setShowForm] = useState(false);
  const [name,     setName]     = useState("");
  const [parentId, setParentId] = useState("");
  const [delId,    setDelId]    = useState<string|null>(null);
  const [search,   setSearch]   = useState("");

  const filtered = items.filter((i:any)=>i.name.toLowerCase().includes(search.toLowerCase()));

  const handle = async () => {
    if(!name.trim()) return;
    await onCreate(name.trim(), parentId);
    setName(""); setParentId(""); setShowForm(false);
  };

  if(loading) return <div style={{color:"#888",padding:"2rem"}}>Cargando...</div>;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
      <div style={{ display:"flex", gap:"0.75rem" }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar..."
          style={{ flex:1, padding:"0.5rem 0.75rem", border:"1px solid #E5E7EB", borderRadius:"8px", fontSize:"0.875rem" }} />
        {isAdmin && <button onClick={()=>setShowForm(!showForm)}
          style={{ padding:"0.5rem 1.1rem", background:"#FF7A00", color:"#fff", border:"none", borderRadius:"8px", cursor:"pointer", fontWeight:700 }}>
          {showForm?"Cancelar":"+ Nuevo"}
        </button>}
      </div>
      {showForm && (
        <div style={{ background:"#fff", borderRadius:"10px", padding:"1rem", display:"flex", gap:"0.5rem", flexWrap:"wrap", border:"2px solid #FF7A00" }}>
          {parentOptions && <select value={parentId} onChange={e=>setParentId(e.target.value)}
            style={{ padding:"0.45rem 0.75rem", border:"1px solid #E5E7EB", borderRadius:"6px", fontSize:"0.85rem" }}>
            <option value="">Seleccioná {parentLabel}...</option>
            {parentOptions.map((o:any)=><option key={o.id} value={o.id}>{o.name}</option>)}
          </select>}
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nombre..."
            onKeyDown={e=>e.key==="Enter"&&handle()}
            style={{ flex:1, minWidth:"160px", padding:"0.45rem 0.75rem", border:"1px solid #E5E7EB", borderRadius:"6px", fontSize:"0.85rem" }} />
          <button onClick={handle} style={{ padding:"0.45rem 1rem", background:"#6BB87A", color:"#fff", border:"none", borderRadius:"6px", cursor:"pointer", fontWeight:700 }}>Crear</button>
        </div>
      )}
      <div style={{ background:"#fff", borderRadius:"12px", overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"#F9FAFB", borderBottom:"2px solid #E5E7EB" }}>
              {[...columns,isAdmin?"":""].map((h:string,i:number)=>(
                <th key={i} style={{ padding:"0.7rem 1rem", textAlign:"left", fontSize:"0.72rem", fontWeight:700, color:"#6B7280", textTransform:"uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length===0 && <tr><td colSpan={columns.length+1} style={{padding:"3rem",textAlign:"center",color:"#9CA3AF"}}>Sin resultados</td></tr>}
            {filtered.map((item:any,idx:number)=>(
              <tr key={item.id} style={{ borderBottom:"1px solid #F3F4F6", background:idx%2===0?"#fff":"#FAFAFA" }}>
                {renderRow(item).map((cell:any,ci:number)=>(<td key={ci} style={{ padding:"0.7rem 1rem", fontSize:"0.875rem" }}>{cell}</td>))}
                {isAdmin && <td style={{ padding:"0.7rem 1rem" }}>
                  {delId===item.id ? (
                    <div style={{ display:"flex", gap:"0.35rem" }}>
                      <button onClick={async()=>{await onDelete(item);setDelId(null);}} style={{ padding:"3px 8px", background:"#EF4444", color:"#fff", border:"none", borderRadius:"5px", cursor:"pointer", fontSize:"0.72rem", fontWeight:700 }}>Confirmar</button>
                      <button onClick={()=>setDelId(null)} style={{ padding:"3px 6px", background:"#f1f5f9", border:"none", borderRadius:"5px", cursor:"pointer", fontSize:"0.72rem" }}>✕</button>
                    </div>
                  ) : (
                    <button onClick={()=>setDelId(item.id)} style={{ padding:"3px 8px", background:"transparent", border:"1px solid #EF4444", color:"#EF4444", borderRadius:"5px", cursor:"pointer", fontSize:"0.72rem", fontWeight:600 }}>Eliminar</button>
                  )}
                </td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
