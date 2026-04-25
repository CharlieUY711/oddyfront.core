import { readFileSync, writeFileSync } from "fs";
const file = "src/app/admin/pages/AdminProfile.tsx";
let c = readFileSync(file, "utf8");

const addressFormComponent = `

// ─── AddressForm Component ────────────────────────────────────────────────────
function AddressForm({ form, setForm, editId, onCancel, onSubmit }: any) {
  const hasCoords = form.lat && form.lng;

  return (
    <div style={{ background:"#FFF8F5", border:"2px solid #FF7A00", borderRadius:"14px", overflow:"hidden" }}>
      <div style={{ padding:"1rem 1.25rem", borderBottom:"1px solid #FFE0CC", fontWeight:700, color:"#FF7A00", fontSize:"0.9rem" }}>
        {editId ? "✏️ Editar dirección" : "📍 Nueva dirección"}
      </div>

      <div style={{ display:"grid", gridTemplateColumns: hasCoords ? "1fr 1fr" : "1fr", gap:0 }}>

        {/* Columna izquierda — formulario */}
        <div style={{ padding:"1.25rem", display:"flex", flexDirection:"column", gap:"0.875rem" }}>

          {/* Etiqueta */}
          <div>
            <label style={{ fontSize:"0.75rem", fontWeight:600, color:"#6B7280", display:"block", marginBottom:"4px" }}>Etiqueta</label>
            <div style={{ display:"flex", gap:"0.5rem" }}>
              {["Casa","Trabajo","Otro"].map(l => (
                <button key={l} onClick={()=>setForm((p:any)=>({...p,label:l}))}
                  style={{ flex:1, padding:"0.5rem", border:\`1.5px solid \${form.label===l?"#FF7A00":"#E5E7EB"}\`,
                    background: form.label===l?"rgba(255,122,0,0.08)":"#fff",
                    color: form.label===l?"#FF7A00":"#6B7280",
                    borderRadius:"8px", cursor:"pointer", fontWeight: form.label===l?700:400, fontSize:"0.85rem" }}>
                  {l==="Casa"?"🏠":l==="Trabajo"?"💼":"📌"} {l}
                </button>
              ))}
            </div>
          </div>

          {/* Dirección con autocomplete */}
          <div>
            <label style={{ fontSize:"0.75rem", fontWeight:600, color:"#6B7280", display:"block", marginBottom:"4px" }}>
              Dirección <span style={{color:"#9CA3AF",fontWeight:400}}>(buscá y seleccioná)</span>
            </label>
            <AddressAutocomplete
              value={form.street}
              onChange={v => setForm((p:any) => ({...p, street:v}))}
              onSelect={({address, lat, lng}) => {
                // Extraer ciudad del resultado
                const parts = address.split(",");
                const city = parts.length > 1 ? parts[parts.length-3]?.trim() || "" : "";
                setForm((p:any) => ({...p, street:address, lat, lng, city}));
              }}
              placeholder="Ej: Av. 18 de Julio 1234"
            />
          </div>

          {/* Numero de puerta + Esquina */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem" }}>
            <div>
              <label style={{ fontSize:"0.75rem", fontWeight:600, color:"#6B7280", display:"block", marginBottom:"4px" }}>Nº de puerta</label>
              <input value={form.doorNumber} onChange={e=>setForm((p:any)=>({...p,doorNumber:e.target.value}))}
                placeholder="Ej: 1234"
                style={{ width:"100%", padding:"0.6rem 0.75rem", border:"1.5px solid #E5E7EB", borderRadius:"8px",
                  fontSize:"0.875rem", outline:"none", boxSizing:"border-box" }}
                onFocus={e=>e.target.style.borderColor="#FF7A00"}
                onBlur={e=>e.target.style.borderColor="#E5E7EB"} />
            </div>
            <div>
              <label style={{ fontSize:"0.75rem", fontWeight:600, color:"#6B7280", display:"block", marginBottom:"4px" }}>Esquina / entre calles</label>
              <input value={form.corner} onChange={e=>setForm((p:any)=>({...p,corner:e.target.value}))}
                placeholder="Ej: Entre Ejido y Andes"
                style={{ width:"100%", padding:"0.6rem 0.75rem", border:"1.5px solid #E5E7EB", borderRadius:"8px",
                  fontSize:"0.875rem", outline:"none", boxSizing:"border-box" }}
                onFocus={e=>e.target.style.borderColor="#FF7A00"}
                onBlur={e=>e.target.style.borderColor="#E5E7EB"} />
            </div>
          </div>

          {/* Ciudad + CP */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem" }}>
            <div>
              <label style={{ fontSize:"0.75rem", fontWeight:600, color:"#6B7280", display:"block", marginBottom:"4px" }}>Ciudad</label>
              <input value={form.city} onChange={e=>setForm((p:any)=>({...p,city:e.target.value}))}
                placeholder="Ej: Montevideo"
                style={{ width:"100%", padding:"0.6rem 0.75rem", border:"1.5px solid #E5E7EB", borderRadius:"8px",
                  fontSize:"0.875rem", outline:"none", boxSizing:"border-box" }}
                onFocus={e=>e.target.style.borderColor="#FF7A00"}
                onBlur={e=>e.target.style.borderColor="#E5E7EB"} />
            </div>
            <div>
              <label style={{ fontSize:"0.75rem", fontWeight:600, color:"#6B7280", display:"block", marginBottom:"4px" }}>Código postal</label>
              <input value={form.zip} onChange={e=>setForm((p:any)=>({...p,zip:e.target.value}))}
                placeholder="Ej: 11300"
                style={{ width:"100%", padding:"0.6rem 0.75rem", border:"1.5px solid #E5E7EB", borderRadius:"8px",
                  fontSize:"0.875rem", outline:"none", boxSizing:"border-box" }}
                onFocus={e=>e.target.style.borderColor="#FF7A00"}
                onBlur={e=>e.target.style.borderColor="#E5E7EB"} />
            </div>
          </div>

          {/* Validación */}
          {!hasCoords && form.street && (
            <div style={{ padding:"0.6rem 0.75rem", background:"#fffbeb", border:"1px solid #FCD34D",
              borderRadius:"8px", fontSize:"0.8rem", color:"#92400e" }}>
              ⚠️ Seleccioná una dirección del autocompletado para validar las coordenadas
            </div>
          )}
          {hasCoords && (
            <div style={{ padding:"0.6rem 0.75rem", background:"#f0fdf4", border:"1px solid #6BB87A",
              borderRadius:"8px", fontSize:"0.8rem", color:"#166534", display:"flex", alignItems:"center", gap:"0.5rem" }}>
              ✅ Dirección validada · {form.lat.toFixed(4)}, {form.lng.toFixed(4)}
            </div>
          )}

          {/* Botones */}
          <div style={{ display:"flex", gap:"0.5rem", justifyContent:"flex-end", paddingTop:"0.25rem" }}>
            <button onClick={onCancel}
              style={{ padding:"0.55rem 1rem", background:"transparent", border:"1.5px solid #E5E7EB",
                borderRadius:"8px", cursor:"pointer", fontSize:"0.85rem", color:"#6B7280" }}>
              Cancelar
            </button>
            <button onClick={onSubmit} disabled={!form.street.trim()}
              style={{ padding:"0.55rem 1.25rem", background: !form.street.trim()?"#ccc":"#FF7A00",
                color:"#fff", border:"none", borderRadius:"8px", cursor: !form.street.trim()?"not-allowed":"pointer",
                fontWeight:700, fontSize:"0.85rem" }}>
              {editId ? "Guardar cambios" : "Agregar dirección"}
            </button>
          </div>
        </div>

        {/* Columna derecha — mapa */}
        {hasCoords && (
          <div style={{ borderLeft:"1px solid #FFE0CC", display:"flex", flexDirection:"column" }}>
            <div style={{ padding:"0.75rem 1rem", fontSize:"0.78rem", fontWeight:600, color:"#9CA3AF",
              borderBottom:"1px solid #FFE0CC", background:"rgba(255,255,255,0.5)" }}>
              📍 Vista previa
            </div>
            <AddressMap lat={form.lat} lng={form.lng} height="100%" />
          </div>
        )}
      </div>
    </div>
  );
}`;

// Insertar antes del último cierre del archivo
c = c.trimEnd() + addressFormComponent + "\n";
writeFileSync(file, c, "utf8");
console.log("OK AddressForm added");
