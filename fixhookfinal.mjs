import { readFileSync, writeFileSync } from "fs";
const file = "src/app/hooks/useProductos.ts";
let c = readFileSync(file, "utf8");

// Reemplazar el bloque corrupto completo
const oldBlock = `        // Traer categorias para el menu
        const { data: catsData } = await supabase
          .from("categorias")
          .select("id, nombre, departamento_id")
          .eq("activo", true)
          .order("nombre");
        // Anidar categorias en departamentos
        const deptsConCats = [depts.map](http://depts.map)(d => ({
          ...d,
          categorias: (catsData || []).filter(c => c.departamento_id === [d.id](http://d.id))
        }));
        setDepartamentos(deptsConCats as any);`;

const newBlock = `        // Traer categorias para el menu
        const { data: catsData } = await supabase
          .from("categorias")
          .select("id, nombre, departamento_id")
          .eq("activo", true)
          .order("nombre");
        // Anidar categorias en departamentos
        const deptsConCats = depts.map(d => ({
          ...d,
          categorias: (catsData || []).filter(cat => cat.departamento_id === d.id)
        }));
        setDepartamentos(deptsConCats as any);`;

if (c.includes("[depts.map](http://depts.map)")) {
  c = c.replace("[depts.map](http://depts.map)", "depts.map");
  console.log("Fixed depts.map");
}
if (c.includes("[d.id](http://d.id)")) {
  c = c.replace("[d.id](http://d.id)", "d.id");
  console.log("Fixed d.id");
}

writeFileSync(file, c, "utf8");

// Verificar
const v = readFileSync(file, "utf8");
console.log("depts.map OK:", v.includes("depts.map(d =>") ? "YES" : "NO");
console.log("d.id OK:", v.includes("d.id)") ? "YES" : "NO");
console.log("No corruption:", !v.includes("http://depts") ? "YES" : "NO");
