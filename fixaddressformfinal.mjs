import { readFileSync, writeFileSync } from "fs";
const file = "src/app/admin/pages/AdminProfile.tsx";
let c = readFileSync(file, "utf8");

// Reemplazar toda la funcion AddressForm
const newForm = `
// ─── AddressForm Component ────────────────────────────────────────────────────
function AddressForm({ form, setForm, editId, onCancel, onSubmit }: any) {
  const hasCoords = !!(form.lat && form.lng);
  const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

  const reverseGeocode = async (lng: number, lat: number) => {
    try {
      // 1. Obtener dirección
      const res  = await fetch(\`https://api.mapbox.com/geocoding/v5/mapbox.places/\${lng},\${lat}.json?access_token=\${TOKEN}&language=es&types=address&limit=1\`);
      const data = await res.json();
      const feat = data.features?.[0];
      if (!feat) return;
      const address = feat.place_name;
      const parts   = address.split(",");
      const city    = parts.length > 1 ? parts[parts.length-3]?.trim() || "" : "";
      const doorNum = feat.address || "";

      // 2. Obtener calles cercanas para esquina
      let corner = "";
      try {
        const resR = await fetch(\`https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/tilequery/\${lng},\${lat}.json?radius=60&limit=10&layers=road&access_token=\${TOKEN}\`);
        const dataR = await resR.json();
        const mainStreet = feat.text || "";
        const roads = [...new Set(
          dataR.features
            ?.map((f: any) => f.properties?.name)
            .filter((n: any) => n && n !== mainStreet && !n.match(/^\\d/))
        )].slice(0,2) as string[];
        if (roads.length > 0) corner = \`entre \${roads.join(" y ")}\`;
      } catch {}

      setForm((p: any) => ({ ...p, street: address, lat, lng, city, doorNumber: doorNum || p.doorNumber, corner: corner || p.corner }));
    } catch {}
  };

  // Geolocalizar si no hay coords aun
  const [locating, setLocating] = useState(!hasCoords);
  useState(() => {
    if (!hasCoords) {
      navigator.geolocation?.getCurrentPosition(
        pos => {
          setForm((p: any) => ({ ...p, lat: pos.coords.latitude, lng: pos.coords.longitude }));
          setLocating(false);
        },
        () => {
          setForm((p: any) => ({ ...p, lat: -34.9011, lng: -56.1645 }));
          setLocating(false);
        }
      );
    }
  });

  return (
    <div style={{ background:"#FFF8F5", border:"2px solid #FF7A00", borderRadius:"14px", overflow:"hidden" }}>
      <div style={{ padding:"0.875rem 1.25rem", borderBottom:"1px solid #FFE0CC", fontWeight:700, color:"#FF7A00", fontSize:"0.9rem" }}>
        {editId ? "✏️ Editar dirección" : "📍 Nueva dirección"}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:0 }}>

        {/* ── Formulario ── */}
        <div style={{ padding:"1.25rem", display:"flex", flexDirection:"column", gap:"0.875rem", overflowY:"auto", maxHeight:"520px" }}>

          {/* Etiqueta */}
          <div>
            <label style={{ fontSize:"0.72rem", fontWeight:600, color:"#6B7280", display:"block", marginBottom:"4px" }}>Etiqueta</label>
            <div style={{ display:"flex", gap:"0.5rem" }}>
              {["Casa","Trabajo","Otro"].map(l => (
                <button key={l} onClick={()=>setForm((p:any)=>({...p,label:l}))}
                  style={{ flex:1, padding:"0.45rem", border:\`1.5px solid \${form.label===l?"#FF7A00":"#E5E7EB"}\`,
                    background: form.label===l?"rgba(255,122,0,0.08)":"#fff",
                    color: form.label===l?"#FF7A00":"#6B7280",
                    borderRadius:"8px", cursor:"pointer", fontWeight:form.label===l?700:400, fontSize:"0.82rem" }}>
                  {l==="Casa"?"🏠":l==="Trabajo"?"💼":"📌"} {l}
                </button>
              ))}
            </div>
          </div>

          {/* Dirección */}
          <div>
            <label style={{ fontSize:"0.72rem", fontWeight:600, color:"#6B7280", display:"block", marginBottom:"4px" }}>
              Calle <span style={{color:"#9CA3AF",fontWeight:400}}>(buscá o mové el mapa →)</span>
            </label>
            <AddressAutocomplete
              value={form.street}
              onChange={v => setForm((p:any) => ({...p, street:v}))}
              onSelect={async ({address, lat, lng}) => {
                const parts = address.split(",");
                const city = parts.length > 1 ? parts[parts.length-3]?.trim() || "" : "";
                setForm((p:any) => ({...p, street:address, lat, lng, city}));
                // Auto-detectar esquinas
                try {
                  const resR = await fetch(\`https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/tilequery/\${lng},\${lat}.json?radius=60&limit=10&layers=road&access_token=\${TOKEN}\`);
                  const dataR = await resR.json();
                  const mainStreet = address.split(",")[0].replace(/\\d+/g,"").trim();
                  const roads = [...new Set(
                    dataR.features?.map((f:any) => f.properties?.name)
                    .filter((n:any) => n && n !== mainStreet && !n.match(/^\\d/))
                  )].slice(0,2) as string[];
                  if (roads.length > 0) setForm((p:any) => ({...p, corner: \`entre \${roads.join(" y ")}\`}));
                } catch {}
              }}
              placeholder="Ej: Convención 1267"
            />
          </div>

          {/* Nro puerta + Esquina */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.6rem" }}>
            <div>
              <label style={{ fontSize:"0.72rem", fontWeight:600, color:"#6B7280", display:"block", marginBottom:"4px" }}>Nº de puerta</label>
              <input value={form.doorNumber} onChange={e=>setForm((p:any)=>({...p,doorNumber:e.target.value}))}
                placeholder="Ej: 1267"
                style={{ width:"100%", padding:"0.55rem 0.7rem", border:"1.5px solid #E5E7EB", borderRadius:"8px", fontSize:"0.85rem", outline:"none", boxSizing:"border-box" }}
                onFocus={e=>e.target.style.borderColor="#FF7A00"}
                onBlur={async e => {
                  e.target.style.borderColor="#E5E7EB";
                  const num = e.target.value.trim();
                  if (!num || !form.street) return;
                  const streetBase = form.street.split(",")[0].replace(/\\d+/g,"").trim();
                  const query = encodeURIComponent(\`\${streetBase} \${num}, \${form.city||"Montevideo"}\`);
                  try {
                    const res = await fetch(\`https://api.mapbox.com/geocoding/v5/mapbox.places/\${query}.json?access_token=\${TOKEN}&language=es&limit=1&types=address\`);
                    const data = await res.json();
                    const feat = data.features?.[0];
                    if (feat) {
                      const [lng, lat] = feat.center;
                      const parts = feat.place_name.split(",");
                      const city = parts.length > 1 ? parts[parts.length-3]?.trim() || "" : "";
                      // Esquinas
                      const resR = await fetch(\`https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/tilequery/\${lng},\${lat}.json?radius=60&limit=10&layers=road&access_token=\${TOKEN}\`);
                      const dataR = await resR.json();
                      const mainStreet = feat.text || "";
                      const roads = [...new Set(
                        dataR.features?.map((f:any) => f.properties?.name)
                        .filter((n:any) => n && n !== mainStreet && !n.match(/^\\d/))
                      )].slice(0,2) as string[];
                      const corner = roads.length > 0 ? \`entre \${roads.join(" y ")}\` : "";
                      setForm((p:any) => ({...p, street: feat.place_name, lat, lng, city, corner: corner || p.corner}));
                    }
                  } catch {}
                }} />
            </div>
            <div>
              <label style={{ fontSize:"0.72rem", fontWeight:600, color:"#6B7280", display:"block", marginBottom:"4px" }}>Esquina / entre calles</label>
              <input value={form.corner} onChange={e=>setForm((p:any)=>({...p,corner:e.target.value}))}
                placeholder="Auto-detectada"
                style={{ width:"100%", padding:"0.55rem 0.7rem", border:"1.5px solid #E5E7EB", borderRadius:"8px", fontSize:"0.85rem", outline:"none", boxSizing:"border-box" }}
                onFocus={e=>e.target.style.borderColor="#FF7A00"}
                onBlur={e=>e.target.style.borderColor="#E5E7EB"} />
            </div>
          </div>

          {/* Apto + Ciudad */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.6rem" }}>
            <div>
              <label style={{ fontSize:"0.72rem", fontWeight:600, color:"#6B7280", display:"block", marginBottom:"4px" }}>Nº de apartamento</label>
              <input value={form.apartment} onChange={e=>setForm((p:any)=>({...p,apartment:e.target.value}))}
                placeholder="Ej: Apto 302"
                style={{ width:"100%", padding:"0.55rem 0.7rem", border:"1.5px solid #E5E7EB", borderRadius:"8px", fontSize:"0.85rem", outline:"none", boxSizing:"border-box" }}
                onFocus={e=>e.target.style.borderColor="#FF7A00"}
                onBlur={e=>e.target.style.borderColor="#E5E7EB"} />
            </div>
            <div>
              <label style={{ fontSize:"0.72rem", fontWeight:600, color:"#6B7280", display:"block", marginBottom:"4px" }}>Ciudad</label>
              <input value={form.city} onChange={e=>setForm((p:any)=>({...p,city:e.target.value}))}
                placeholder="Ej: Montevideo"
                style={{ width:"100%", padding:"0.55rem 0.7rem", border:"1.5px solid #E5E7EB", borderRadius:"8px", fontSize:"0.85rem", outline:"none", boxSizing:"border-box" }}
                onFocus={e=>e.target.style.borderColor="#FF7A00"}
                onBlur={e=>e.target.style.borderColor="#E5E7EB"} />
            </div>
          </div>

          {/* CP + Indicaciones */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:"0.6rem" }}>
            <div>
              <label style={{ fontSize:"0.72rem", fontWeight:600, color:"#6B7280", display:"block", marginBottom:"4px" }}>Código postal</label>
              <input value={form.zip} onChange={e=>setForm((p:any)=>({...p,zip:e.target.value}))}
                placeholder="Ej: 11300"
                style={{ width:"100%", padding:"0.55rem 0.7rem", border:"1.5px solid #E5E7EB", borderRadius:"8px", fontSize:"0.85rem", outline:"none", boxSizing:"border-box" }}
                onFocus={e=>e.target.style.borderColor="#FF7A00"}
                onBlur={e=>e.target.style.borderColor="#E5E7EB"} />
            </div>
            <div>
              <label style={{ fontSize:"0.72rem", fontWeight:600, color:"#6B7280", display:"block", marginBottom:"4px" }}>Indicaciones de entrega</label>
              <input value={form.indicaciones} onChange={e=>setForm((p:any)=>({...p,indicaciones:e.target.value}))}
                placeholder="Ej: Timbre roto, llamar al llegar"
                style={{ width:"100%", padding:"0.55rem 0.7rem", border:"1.5px solid #E5E7EB", borderRadius:"8px", fontSize:"0.85rem", outline:"none", boxSizing:"border-box" }}
                onFocus={e=>e.target.style.borderColor="#FF7A00"}
                onBlur={e=>e.target.style.borderColor="#E5E7EB"} />
            </div>
          </div>

          {/* Estado validación */}
          {hasCoords ? (
            <div style={{ padding:"0.5rem 0.75rem", background:"#f0fdf4", border:"1px solid #6BB87A",
              borderRadius:"8px", fontSize:"0.78rem", color:"#166534", display:"flex", gap:"0.5rem", alignItems:"center" }}>
              ✅ Validada · {form.lat?.toFixed(4)}, {form.lng?.toFixed(4)}
              {form.corner && <span style={{color:"#6B7280"}}>· {form.corner}</span>}
            </div>
          ) : (
            <div style={{ padding:"0.5rem 0.75rem", background:"#fffbeb", border:"1px solid #FCD34D",
              borderRadius:"8px", fontSize:"0.78rem", color:"#92400e" }}>
              📍 Buscá una dirección o hacé click en el mapa
            </div>
          )}

          {/* Botones */}
          <div style={{ display:"flex", gap:"0.5rem", justifyContent:"flex-end" }}>
            <button onClick={onCancel}
              style={{ padding:"0.55rem 1rem", background:"transparent", border:"1.5px solid #E5E7EB",
                borderRadius:"8px", cursor:"pointer", fontSize:"0.85rem", color:"#6B7280" }}>
              Cancelar
            </button>
            <button onClick={onSubmit} disabled={!form.street?.trim()}
              style={{ padding:"0.55rem 1.25rem",
                background: !form.street?.trim() ? "#ccc" : "#FF7A00",
                color:"#fff", border:"none", borderRadius:"8px",
                cursor: !form.street?.trim() ? "not-allowed" : "pointer",
                fontWeight:700, fontSize:"0.85rem" }}>
              {editId ? "Guardar cambios" : "Agregar dirección"}
            </button>
          </div>
        </div>

        {/* ── Mapa siempre visible ── */}
        <div style={{ borderLeft:"1px solid #FFE0CC", display:"flex", flexDirection:"column", minHeight:"400px" }}>
          <div style={{ padding:"0.6rem 1rem", fontSize:"0.75rem", fontWeight:600, color:"#9CA3AF",
            borderBottom:"1px solid #FFE0CC", background:"rgba(255,255,255,0.5)",
            display:"flex", alignItems:"center", gap:"0.4rem" }}>
            🗺️ {hasCoords ? "Ajustá el pin o hacé click en el mapa" : "Detectando tu ubicación..."}
          </div>
          {(hasCoords || locating) && (
            <div style={{ flex:1 }}>
              <AddressMap
                lat={form.lat || -34.9011}
                lng={form.lng || -56.1645}
                height="100%"
                interactive
                onLocationChange={async ({address, lat, lng}) => {
                  await reverseGeocode(lng, lat);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}`;

// Reemplazar toda la funcion AddressForm
const start = c.indexOf("// ─── AddressForm Component");
const end   = c.lastIndexOf("}") + 1;
if (start !== -1) {
  c = c.substring(0, start) + newForm.trim() + "\n";
  writeFileSync(file, c, "utf8");
  console.log("OK - AddressForm replaced");
} else {
  console.log("WARN - AddressForm not found");
}
