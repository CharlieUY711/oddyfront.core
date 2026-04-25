import { readFileSync, writeFileSync } from "fs";
const file = "src/app/admin/pages/AdminProfile.tsx";
let c = readFileSync(file, "utf8");

// 1. Agregar apartment e indicaciones a la interface
c = c.replace(
`interface Address {
  id:         string;
  label:      string;
  street:     string;
  doorNumber?: string;
  corner?:    string;
  city:       string;
  zip:        string;
  lat?:       number;
  lng?:       number;
  isDefault:  boolean;
}`,
`interface Address {
  id:           string;
  label:        string;
  street:       string;
  doorNumber?:  string;
  corner?:      string;
  apartment?:   string;
  indicaciones?: string;
  city:         string;
  zip:          string;
  lat?:         number;
  lng?:         number;
  isDefault:    boolean;
}`
);

// 2. Agregar al estado del form
c = c.replace(
  `const [form,    setForm]    = useState({ label:"Casa", street:"", doorNumber:"", corner:"", city:"", zip:"", lat:0, lng:0 });`,
  `const [form,    setForm]    = useState({ label:"Casa", street:"", doorNumber:"", corner:"", apartment:"", indicaciones:"", city:"", zip:"", lat:0, lng:0 });`
);

// 3. Agregar al reset del form
c = c.replace(
  `setForm({ label:"Casa", street:"", doorNumber:"", corner:"", city:"", zip:"", lat:0, lng:0 }); setAdding(false);`,
  `setForm({ label:"Casa", street:"", doorNumber:"", corner:"", apartment:"", indicaciones:"", city:"", zip:"", lat:0, lng:0 }); setAdding(false);`
);
c = c.replace(
  `setForm({ label:"Casa", street:"", doorNumber:"", corner:"", city:"", zip:"", lat:0, lng:0 }); }}`,
  `setForm({ label:"Casa", street:"", doorNumber:"", corner:"", apartment:"", indicaciones:"", city:"", zip:"", lat:0, lng:0 }); }}`
);

// 4. Agregar apartment e indicaciones al newAddr
c = c.replace(
  `const newAddr: Address = { id: Date.now().toString(), label: form.label, street: form.street, doorNumber: form.doorNumber, corner: form.corner, city: form.city, zip: form.zip, lat: form.lat, lng: form.lng, isDefault: addresses.length === 0 };`,
  `const newAddr: Address = { id: Date.now().toString(), label: form.label, street: form.street, doorNumber: form.doorNumber, corner: form.corner, apartment: form.apartment, indicaciones: form.indicaciones, city: form.city, zip: form.zip, lat: form.lat, lng: form.lng, isDefault: addresses.length === 0 };`
);

// 5. Agregar campos al AddressForm — despues de Esquina agregar Apto e Indicaciones
c = c.replace(
`          {/* Ciudad + CP */}`,
`          {/* Apto + Indicaciones */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:"0.75rem" }}>
            <div>
              <label style={{ fontSize:"0.75rem", fontWeight:600, color:"#6B7280", display:"block", marginBottom:"4px" }}>Nº de apartamento</label>
              <input value={form.apartment} onChange={e=>setForm((p:any)=>({...p,apartment:e.target.value}))}
                placeholder="Ej: Apto 302"
                style={{ width:"100%", padding:"0.6rem 0.75rem", border:"1.5px solid #E5E7EB", borderRadius:"8px",
                  fontSize:"0.875rem", outline:"none", boxSizing:"border-box" }}
                onFocus={e=>e.target.style.borderColor="#FF7A00"}
                onBlur={e=>e.target.style.borderColor="#E5E7EB"} />
            </div>
            <div>
              <label style={{ fontSize:"0.75rem", fontWeight:600, color:"#6B7280", display:"block", marginBottom:"4px" }}>Indicaciones de entrega</label>
              <input value={form.indicaciones} onChange={e=>setForm((p:any)=>({...p,indicaciones:e.target.value}))}
                placeholder="Ej: Timbre roto, llamar al llegar"
                style={{ width:"100%", padding:"0.6rem 0.75rem", border:"1.5px solid #E5E7EB", borderRadius:"8px",
                  fontSize:"0.875rem", outline:"none", boxSizing:"border-box" }}
                onFocus={e=>e.target.style.borderColor="#FF7A00"}
                onBlur={e=>e.target.style.borderColor="#E5E7EB"} />
            </div>
          </div>

          {/* Ciudad + CP */}`
);

// 6. Actualizar geocode al escribir numero de puerta — buscar en Mapbox con el numero
// Agregar onBlur al campo doorNumber para re-geocodificar
c = c.replace(
  `              <input value={form.doorNumber} onChange={e=>setForm((p:any)=>({...p,doorNumber:e.target.value}))}
                placeholder="Ej: 1234"
                style={{ width:"100%", padding:"0.6rem 0.75rem", border:"1.5px solid #E5E7EB", borderRadius:"8px",
                  fontSize:"0.875rem", outline:"none", boxSizing:"border-box" }}
                onFocus={e=>e.target.style.borderColor="#FF7A00"}
                onBlur={e=>e.target.style.borderColor="#E5E7EB"} />`,
  `              <input value={form.doorNumber} onChange={e=>setForm((p:any)=>({...p,doorNumber:e.target.value}))}
                placeholder="Ej: 1234"
                style={{ width:"100%", padding:"0.6rem 0.75rem", border:"1.5px solid #E5E7EB", borderRadius:"8px",
                  fontSize:"0.875rem", outline:"none", boxSizing:"border-box" }}
                onFocus={e=>e.target.style.borderColor="#FF7A00"}
                onBlur={async e => {
                  e.target.style.borderColor="#E5E7EB";
                  const num = e.target.value.trim();
                  if (!num || !form.street) return;
                  // Extraer nombre de calle base (sin numero anterior)
                  const streetBase = form.street.split(",")[0].replace(/\\d+/g,"").trim();
                  const query = encodeURIComponent(\`\${streetBase} \${num}, \${form.city || "Montevideo"}\`);
                  try {
                    const res = await fetch(\`https://api.mapbox.com/geocoding/v5/mapbox.places/\${query}.json?access_token=\${import.meta.env.VITE_MAPBOX_TOKEN}&language=es&limit=1&types=address\`);
                    const data = await res.json();
                    const feat = data.features?.[0];
                    if (feat) {
                      const [lng, lat] = feat.center;
                      const parts = feat.place_name.split(",");
                      const city = parts.length > 1 ? parts[parts.length-3]?.trim() || "" : "";
                      setForm((p:any) => ({...p, street: feat.place_name, lat, lng, city}));
                    }
                  } catch {}
                }} />`
);

writeFileSync(file, c, "utf8");
console.log("OK");
