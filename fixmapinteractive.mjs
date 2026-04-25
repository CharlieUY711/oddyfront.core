import { readFileSync, writeFileSync } from "fs";
const file = "src/app/admin/pages/AdminProfile.tsx";
let c = readFileSync(file, "utf8");

// Reemplazar el AddressMap en AddressForm para hacerlo interactivo
c = c.replace(
  `<AddressMap lat={form.lat} lng={form.lng} height="1…`,
  `<AddressMap lat={form.lat} lng={form.lng} height="100%" interactive onLocationChange={({address, lat, lng}) => { const parts = address.split(","); const city = parts.length > 1 ? parts[parts.length-3]?.trim() || "" : ""; setForm((p:any) => ({...p, street:address, lat, lng, city})); }} />`
);

// Busqueda mas amplia si el anterior no matchea
if (!c.includes('interactive onLocationChange')) {
  c = c.replace(
    'AddressMap lat={form.lat} lng={form.lng} height="100%"',
    'AddressMap lat={form.lat} lng={form.lng} height="100%" interactive onLocationChange={({address, lat, lng}: {address:string;lat:number;lng:number}) => { const parts = address.split(","); const city = parts.length > 1 ? parts[parts.length-3]?.trim() || "" : ""; setForm((p:any) => ({...p, street:address, lat, lng, city})); }}'
  );
}

writeFileSync(file, c, "utf8");
console.log(c.includes('interactive') ? "OK - interactive added" : "WARN - not found");
