import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/admin/pages/AdminProfile.tsx';
let c = readFileSync(file, 'utf8');

// Reemplazar el input de "Calle y número" por AddressAutocomplete
c = c.replace(
  `        <InputField label="Calle y número" value={form.street} onChange={v=>setForm(p=>({...p,street:v}))} placeholder="Ej: Av. 18 de Julio 1234" />`,
  `        <div>
              <label style={{ fontSize:"0.75rem", fontWeight:600, color:"#6B7280", display:"block", marginBottom:"4px" }}>Calle y número</label>
              <AddressAutocomplete
                value={form.street}
                onChange={v => setForm(p=>({...p, street:v}))}
                onSelect={({address, lat, lng}) => setForm(p=>({...p, street:address, lat, lng}))}
                placeholder="Ej: Av. 18 de Julio 1234"
              />
            </div>`
);

// Agregar lat/lng al tipo del form
c = c.replace(
  "const [form,    setForm]    = useState({ label:\"Casa\", street:\"\", city:\"\", zip:\"\" });",
  "const [form,    setForm]    = useState({ label:\"Casa\", street:\"\", city:\"\", zip:\"\", lat:0, lng:0 });"
);

// Agregar lat/lng a la Address interface si no tiene
c = c.replace(
  `interface Address {
  id:        string;
  label:     string;
  street:    string;
  city:      string;
  zip:       string;
  isDefault: boolean;
}`,
  `interface Address {
  id:        string;
  label:     string;
  street:    string;
  city:      string;
  zip:       string;
  lat?:      number;
  lng?:      number;
  isDefault: boolean;
}`
);

// Pasar lat/lng al crear address
c = c.replace(
  "const newAddr: Address = { id: Date.now().toString(), ...form, isDefault: addresses.length === 0 };",
  "const newAddr: Address = { id: Date.now().toString(), label: form.label, street: form.street, city: form.city, zip: form.zip, lat: form.lat, lng: form.lng, isDefault: addresses.length === 0 };"
);

writeFileSync(file, c, 'utf8');
console.log('OK');
