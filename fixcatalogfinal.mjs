import { readFileSync, writeFileSync } from "fs";
const file = "src/app/admin/pages/AdminCatalog.tsx";
let c = readFileSync(file, "utf8");

// Cambiar tablas a las correctas
c = c.replaceAll('from("departments")', 'from("departamentos")');
c = c.replaceAll('from("categories")', 'from("categorias")');

// Corregir campos: name → nombre, is_active → activo, position → orden
c = c.replaceAll('.order("orden"', '.order("orden"');
c = c.replaceAll('.name', '.nombre');
c = c.replaceAll('d.name', 'd.nombre');
c = c.replaceAll('cat.name', 'cat.nombre');
c = c.replaceAll('depto.name', 'depto.nombre');
c = c.replaceAll('.is_active', '.activo');
c = c.replaceAll('is_active:', 'activo:');
c = c.replaceAll('.position', '.orden');
c = c.replaceAll('position:', 'orden:');
c = c.replaceAll('department_id', 'departamento_id');

// Corregir interfaces
c = c.replace(
  "interface Departamento { id: string; name: string; color: string; is_active: boolean; position: number; slug: string; }",
  "interface Departamento { id: string; nombre: string; color: string; activo: boolean; orden: number; }"
);
c = c.replace(
  "interface Categoria    { id: string; name: string; department_id: string; is_active?: boolean; slug: string; }",
  "interface Categoria    { id: string; nombre: string; departamento_id: string; activo?: boolean; }"
);

// Corregir insert departamento
c = c.replace(
  `{ nombre, color:"#FF6835", activo: true, orden: deptos.length + 1 }`,
  `{ nombre, color:"#FF6835", activo: true, orden: deptos.length + 1 }`
);

// Corregir insert categoria
c = c.replace(
  `{ nombre, departamento_id: departamento_id }`,
  `{ nombre, departamento_id }`
);

writeFileSync(file, c, "utf8");
console.log("OK");
