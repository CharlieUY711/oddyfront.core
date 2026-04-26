import { readFileSync, writeFileSync } from "fs";
const file = "src/app/public/OddyStorefront.tsx";
let c = readFileSync(file, "utf8");

// Reemplazar el array hardcodeado por los departamentos de Supabase
c = c.replace(
  `{['Electrodomésticos', 'Almacén', 'Limpieza', 'Moda', 'Electrónica', 'Hogar', 'Accesorios', 'Mascotas'].map((menuItem) => {
            const categories = getCategoriesForMenu(menuItem);`,
  `{departamentos.map((depto) => {
            const menuItem = depto.nombre;
            const categories = getCategoriesForMenu(menuItem);`
);

// Reemplazar getCategoriesForMenu para usar categorias de Supabase
// Buscar la funcion y reemplazarla
c = c.replace(
  `const getCategoriesForMenu = (menuItem: string): string[] => {
    if (!departamentos || departamentos.length === 0) {
      // Fallback: categorías por defecto si no hay departamentos
`,
  `const getCategoriesForMenu = (menuItem: string): string[] => {
    // Usar categorías de Supabase si están disponibles
    if (departamentos && departamentos.length > 0) {
      const depto = departamentos.find(d => d.nombre === menuItem);
      if (depto && (depto as any).categorias) {
        return (depto as any).categorias.map((c: any) => c.nombre);
      }
    }
    if (!departamentos || departamentos.length === 0) {
      // Fallback vacío
`
);

writeFileSync(file, c, "utf8");
console.log("OK");
