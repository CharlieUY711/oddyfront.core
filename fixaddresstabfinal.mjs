import { readFileSync, writeFileSync } from "fs";
const file = "src/app/admin/pages/AdminProfile.tsx";
let c = readFileSync(file, "utf8");

// Reemplazar el estado del form en AddressesTab
c = c.replace(
  `const [form,    setForm]    = useState({ label:"Casa", street:"", city:"", zip:"" });`,
  `const [form,    setForm]    = useState({ label:"Casa", street:"", doorNumber:"", corner:"", city:"", zip:"", lat:0, lng:0 });`
);

// Reemplazar el bloque del form inline por el componente AddressForm
const oldBlock = `      {/* Form agregar */}
      {(adding || editId) && (
        <div style={{ background:"#FFF8F5", border:"2px solid #FF7A00", borderRadius:"12px", padding:"1.25rem", display:"flex", flexDirection:"column", gap:"0.75rem" }}>
          <div style={{ fontWeight:700, color:"#FF7A00", fontSize:"0.9rem" }}>{editId ? "Editar dirección" : "Nueva dirección"}</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem" }}>
            <div>
              <label style={{ fontSize:"0.75rem", fontWeight:600, color:"#6B7280", display:"block", marginBottom:"4px" }}>Etiqueta</label>
              <select value={form.label} onChange={e=>setForm(p=>({...p,label:e.target.value}))}
                style={{ width:"100%", padding:"0.6rem 0.75rem", border:"1.5px solid #E5E7EB", borderRadius:"8px", fontSize:"0.875rem" }}>
                {["Casa","Trabajo","Otro"].map(l=><option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:"0.75rem", fontWeight:600, color:"#6B7280", display:"block", marginBottom:"4px" }}>Calle y número</label>
              <AddressAutocomplete
                value={form.street}
                onChange={v => setForm(p=>({...p, street:v}))}
                onSelect={({address, lat, lng}) => setForm(p=>({...p, street:address, lat, lng}))}
                placeholder="Ej: Av. 18 de Julio 1234"
              />
            </div>
            <InputField label="Ciudad" value={form.city} onChange={v=>setForm(p=>({...p,city:v}))} placeholder="Ej: Montevideo" />
            <InputField label="Código postal" value={form.zip} onChange={v=>setForm(p=>({...p,zip:v}))} placeholder="Ej: 11300" />
          </div>
          <div style={{ display:"flex", gap:"0.5rem", justifyContent:"flex-end" }}>
            <button onClick={() => { setAdding(false); setEditId(null); }}
              style={{ padding:"0.5rem 1rem", background:"transparent", border:"1px solid #E5E7EB", borderRadius:"8px", cursor:"pointer", fontSize:"0.85rem" }}>Cancelar</button>
            <button onClick={editId ? handleEdit : handleAdd}
              style={{ padding:"0.5rem 1.25rem", background:"#FF7A00", color:"#fff", border:"none", borderRadius:"8px", cursor:"pointer", fontWeight:700, fontSize:"0.85rem" }}>
              {editId ? "Guardar cambios" : "Agregar"}
            </button>
          </div>
        </div>
      )}`;

const newBlock = `      {/* Form agregar */}
      {(adding || editId) && (
        <AddressForm
          form={form}
          setForm={setForm}
          editId={editId}
          onCancel={() => { setAdding(false); setEditId(null); setForm({ label:"Casa", street:"", doorNumber:"", corner:"", city:"", zip:"", lat:0, lng:0 }); }}
          onSubmit={editId ? handleEdit : handleAdd}
        />
      )}`;

if (c.includes(oldBlock)) {
  c = c.replace(oldBlock, newBlock);
  console.log("✓ Form replaced");
} else {
  console.log("✗ Block not found — trying line-based replace");
}

// Actualizar handleAdd para incluir doorNumber y corner
c = c.replace(
  `const newAddr: Address = { id: Date.now().toString(), label: form.label, street: form.street, city: form.city, zip: form.zip, isDefault: addresses.length === 0 };`,
  `const newAddr: Address = { id: Date.now().toString(), label: form.label, street: form.street, doorNumber: form.doorNumber, corner: form.corner, city: form.city, zip: form.zip, lat: form.lat, lng: form.lng, isDefault: addresses.length === 0 };`
);

// Resetear form al agregar
c = c.replace(
  `setForm({ label:"Casa", street:"", city:"", zip:"" }); setAdding(false);`,
  `setForm({ label:"Casa", street:"", doorNumber:"", corner:"", city:"", zip:"", lat:0, lng:0 }); setAdding(false);`
);

// Actualizar interface Address
c = c.replace(
`interface Address {
  id:        string;
  label:     string;
  street:    string;
  city:      string;
  zip:       string;
  lat?:      number;
  lng?:      number;
  isDefault: boolean;
}`,
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
}`
);

// Importar AddressMap si no está
if (!c.includes("import AddressMap")) {
  c = c.replace(
    'import AddressCard from "../../components/profile/AddressCard";',
    'import AddressCard from "../../components/profile/AddressCard";\nimport AddressMap from "../../components/maps/AddressMap";'
  );
}

writeFileSync(file, c, "utf8");
console.log("Done");
