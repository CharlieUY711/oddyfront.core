import { readFileSync, writeFileSync } from "fs";
const file = "src/app/hooks/useProductos.ts";
let c = readFileSync(file, "utf8");

// Agregar fetch de categorias junto con departamentos
c = c.replace(
  "const depts = await fetchDepartamentos(true);",
  `const depts = await fetchDepartamentos(true);
        // Traer categorias para el menu
        const { data: catsData } = await supabase
          .from("categorias")
          .select("id, nombre, departamento_id")
          .eq("activo", true)
          .order("nombre");
        // Anidar categorias en departamentos
        const deptsConCats = depts.map(d => ({
          ...d,
          categorias: (catsData || []).filter(c => c.departamento_id === d.id)
        }));`
);

// Usar deptsConCats en lugar de depts
c = c.replace(
  "setDepartamentos(depts);",
  "setDepartamentos(deptsConCats as any);"
);

writeFileSync(file, c, "utf8");
console.log("OK");
