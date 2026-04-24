import { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router";
import { supabase } from "../../../utils/supabase/client";

export default function AdminPublicaciones() {
  const { user } = useOutletContext<any>() || {};
  const [productos, setProductos] = useState<any[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [showForm,  setShowForm]  = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [msg,       setMsg]       = useState<{text:string;type:"ok"|"err"}|null>(null);
  const [form, setForm] = useState({
    nombre:"", descripcion:"", precio:"", precio_original:"",
    imagen_principal:"", condicion:"Bueno", departamento_nombre:""
  });

  const notify = (text:string, type:"ok"|"err") => {
    setMsg({text,type}); setTimeout(()=>setMsg(null),3000);
  };

  const cargar = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("productos_secondhand")
      .select("id, nombre, precio, status, condicion, imagen_principal, created_at, departamento_nombre")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setProductos(data || []);
    setLoading(false);
  }, [user]);

  useEffect(() => { cargar(); }, [cargar]);

  const handlePublicar = async () => {
    if (!form.nombre || !form.precio) { notify("Completá nombre y precio","err"); return; }
    setSaving(true);
    const { error } = await supabase.from("productos_secondhand").insert({
      nombre:             form.nombre,
      descripcion:        form.descripcion,
      precio:             Number(form.precio),
      precio_original:    form.precio_original ? Number(form.precio_original) : null,
      imagen_principal:   form.imagen_principal,
      condicion:          form.condicion,
      departamento_nombre: form.departamento_nombre,
      user_id:            user.id,
      status:             "active",
      estado:             "activo",
    });
    if (error) notify(error.message,"err");
    else { notify("Publicado ✓","ok"); setShowForm(false); setForm({nombre:"",descripcion:"",precio:"",precio_original:"",imagen_principal:"",condicion:"Bueno",departamento_nombre:""}); cargar(); }
    setSaving(false);
  };

  const toggleStatus = async (id:string, current:string) => {
    await supabase.from("productos_secondhand")
      .update({ status: current==="active" ? "inactive" : "active" })
      .eq("id", id);
    notify("Actualizado","ok"); cargar();
  };

  const eliminar = async (id:string) => {
    if (!confirm("¿Eliminar esta publicación?")) return;
    await supabase.from("productos_secondhand").delete().eq("id", id);
    notify("Eliminado","ok"); cargar();
  };

  if (loading) return <div style={{color:"#888",padding:"2rem"}}>Cargando...</div>;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <button onClick={()=>setShowForm(!showForm)}
          style={{ padding:"0.5rem 1.1rem", background:"#6BB87A", color:"#fff", border:"none", borderRadius:"8px", cursor:"pointer", fontWeight:700 }}>
          {showForm?"Cancelar":"+ Nueva publicación"}
        </button>
      </div>

      {msg && (
        <div style={{ padding:"0.75rem 1rem", borderRadius:"8px", fontSize:"0.85rem", fontWeight:600,
          background: msg.type==="ok"?"#f0fdf4":"#fef2f2",
          color: msg.type==="ok"?"#166534":"#dc2626",
          border:`1px solid ${msg.type==="ok"?"#6BB87A":"#ef4444"}` }}>
          {msg.type==="ok"?"✅":"❌"} {msg.text}
        </div>
      )}

      {showForm && (
        <div style={{ background:"#fff", borderRadius:"12px", padding:"1.5rem", border:"2px solid #6BB87A" }}>
          <h3 style={{ margin:"0 0 1rem", fontWeight:700, color:"#444" }}>Nueva publicación</h3>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem" }}>
            {[
              {label:"Nombre *",            key:"nombre",            type:"text",   placeholder:"iPhone 13 Pro"},
              {label:"Precio ($U) *",       key:"precio",            type:"number", placeholder:"25000"},
              {label:"Precio original ($U)",key:"precio_original",   type:"number", placeholder:"45000"},
              {label:"Categoría",           key:"departamento_nombre",type:"text",  placeholder:"Electrónica"},
              {label:"URL imagen",          key:"imagen_principal",  type:"text",   placeholder:"https://..."},
            ].map(f => (
              <div key={f.key}>
                <label style={{ display:"block", fontSize:"0.8rem", fontWeight:600, color:"#555", marginBottom:"4px" }}>{f.label}</label>
                <input type={f.type} value={(form as any)[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.placeholder}
                  style={{ width:"100%", padding:"0.6rem 0.75rem", border:"1.5px solid #E5E7EB", borderRadius:"7px", fontSize:"0.875rem", outline:"none", boxSizing:"border-box" }} />
              </div>
            ))}
            <div>
              <label style={{ display:"block", fontSize:"0.8rem", fontWeight:600, color:"#555", marginBottom:"4px" }}>Descripción</label>
              <input type="text" value={form.descripcion} onChange={e=>setForm(p=>({...p,descripcion:e.target.value}))} placeholder="Estado, accesorios..."
                style={{ width:"100%", padding:"0.6rem 0.75rem", border:"1.5px solid #E5E7EB", borderRadius:"7px", fontSize:"0.875rem", outline:"none", boxSizing:"border-box" }} />
            </div>
            <div>
              <label style={{ display:"block", fontSize:"0.8rem", fontWeight:600, color:"#555", marginBottom:"4px" }}>Condición</label>
              <select value={form.condicion} onChange={e=>setForm(p=>({...p,condicion:e.target.value}))}
                style={{ width:"100%", padding:"0.6rem 0.75rem", border:"1.5px solid #E5E7EB", borderRadius:"7px", fontSize:"0.875rem" }}>
                {["Excelente","Muy bueno","Bueno","Regular","Aceptable"].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <button onClick={handlePublicar} disabled={saving}
            style={{ marginTop:"1rem", padding:"0.75rem 2rem", background:saving?"#ccc":"#6BB87A", color:"#fff", border:"none", borderRadius:"8px", fontWeight:700, cursor:saving?"not-allowed":"pointer" }}>
            {saving?"Publicando...":"Publicar"}
          </button>
        </div>
      )}

      {productos.length === 0 ? (
        <div style={{ background:"#fff", borderRadius:"12px", padding:"3rem", textAlign:"center" }}>
          <div style={{ fontSize:"3rem" }}>♻️</div>
          <p style={{ color:"#888", margin:"0.5rem 0 0" }}>No tenés publicaciones aún</p>
        </div>
      ) : (
        <div style={{ background:"#fff", borderRadius:"12px", overflow:"hidden" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"#F9FAFB", borderBottom:"2px solid #E5E7EB" }}>
                {["Imagen","Nombre","Precio","Condición","Estado","Acciones"].map(h=>(
                  <th key={h} style={{ padding:"0.75rem 1rem", textAlign:"left", fontSize:"0.73rem", fontWeight:700, color:"#6B7280", textTransform:"uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {productos.map((p,idx)=>(
                <tr key={p.id} style={{ borderBottom:"1px solid #F3F4F6", background:idx%2===0?"#fff":"#FAFAFA" }}>
                  <td style={{ padding:"0.75rem 1rem" }}>
                    {p.imagen_principal
                      ? <img src={p.imagen_principal} alt={p.nombre} style={{ width:"48px", height:"48px", objectFit:"cover", borderRadius:"6px" }} />
                      : <div style={{ width:"48px", height:"48px", background:"#E5E7EB", borderRadius:"6px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.25rem" }}>♻️</div>
                    }
                  </td>
                  <td style={{ padding:"0.75rem 1rem", fontWeight:600, color:"#111", fontSize:"0.9rem" }}>{p.nombre}</td>
                  <td style={{ padding:"0.75rem 1rem", fontWeight:700, color:"#111" }}>$U {Number(p.precio).toLocaleString("es-UY")}</td>
                  <td style={{ padding:"0.75rem 1rem", fontSize:"0.85rem", color:"#555" }}>{p.condicion}</td>
                  <td style={{ padding:"0.75rem 1rem" }}>
                    <span style={{ padding:"3px 10px", borderRadius:"20px", fontSize:"0.72rem", fontWeight:700,
                      background: p.status==="active"?"#f0fdf4":"#f1f5f9",
                      color: p.status==="active"?"#166534":"#64748b" }}>
                      {p.status==="active"?"Activo":"Inactivo"}
                    </span>
                  </td>
                  <td style={{ padding:"0.75rem 1rem" }}>
                    <div style={{ display:"flex", gap:"0.4rem" }}>
                      <button onClick={()=>toggleStatus(p.id,p.status)}
                        style={{ padding:"4px 10px", background:"transparent", border:`1px solid ${p.status==="active"?"#F59E0B":"#6BB87A"}`, color:p.status==="active"?"#F59E0B":"#6BB87A", borderRadius:"6px", cursor:"pointer", fontSize:"0.75rem", fontWeight:600 }}>
                        {p.status==="active"?"Pausar":"Activar"}
                      </button>
                      <button onClick={()=>eliminar(p.id)}
                        style={{ padding:"4px 10px", background:"transparent", border:"1px solid #EF4444", color:"#EF4444", borderRadius:"6px", cursor:"pointer", fontSize:"0.75rem", fontWeight:600 }}>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
