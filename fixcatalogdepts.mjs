import { readFileSync, writeFileSync } from "fs";
const file = "src/app/admin/pages/AdminCatalog.tsx";
let c = readFileSync(file, "utf8");

// Cambiar tabla departamentos → departments y categorias → categories
c = c.replaceAll('from("departamentos")', 'from("departments")');
c = c.replaceAll('from("categorias")', 'from("categories")');

// Adaptar campos: nombre → name, activo → is_active, orden → position
c = c.replaceAll('.nombre', '.name');
c = c.replaceAll('nombre:', 'name:');
c = c.replaceAll('.activo', '.is_active');
c = c.replaceAll('activo:', 'is_active:');
c = c.replaceAll('.orden', '.position');
c = c.replaceAll('orden:', 'position:');
c = c.replaceAll('departamento_id', 'department_id');

// Adaptar interfaces
c = c.replace(
  'interface Departamento { id: string; nombre: string; color: string; activo: boolean; orden: number; }',
  'interface Departamento { id: string; name: string; color: string; is_active: boolean; position: number; slug: string; }'
);
c = c.replace(
  'interface Categoria    { id: string; nombre: string; departamento_id: string; activo?: boolean; }',
  'interface Categoria    { id: string; name: string; department_id: string; is_active?: boolean; slug: string; }'
);

// Fix insert departamento
c = c.replace(
  '{ name: nombre, color:"#FF6835", is_active: true, position: deptos.length + 1 }',
  '{ name: nombre, slug: nombre.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g,"").replace(/[^a-z0-9]+/g,"-"), is_active: true, position: deptos.length + 1 }'
);

// Fix insert categoria
c = c.replace(
  '{ name: nombre, department_id }',
  '{ name: nombre, slug: nombre.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g,"").replace(/[^a-z0-9]+/g,"-"), department_id }'
);

// Fix orden en query
c = c.replace(
  '.order("position", { ascending: true })',
  '.order("position", { ascending: true, nullsFirst: false })'
);

// Fix activo check
c = c.replaceAll('depto.is_active ? 1 : 0.55', 'depto.is_active ? 1 : 0.55');
c = c.replaceAll('d=>d.is_active', 'd=>d.is_active');

writeFileSync(file, c, "utf8");
console.log("OK");
