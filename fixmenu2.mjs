import { readFileSync, writeFileSync } from "fs";
const file = "src/app/public/OddyStorefront.tsx";
let c = readFileSync(file, "utf8");

// Fix links corruptos de PowerShell
c = c.replace("[departamentos.map](http://departamentos.map)", "departamentos.map");
c = c.replace("[categorias.map](http://categorias.map)", "categorias.map");
c = c.replace("[System.IO.File]", "System.IO.File");

// Verificar si el menu ya usa departamentos.map
const hasNewMenu = c.includes("departamentos.map((depto");
const hasOldMenu = c.includes("'Electrodomésticos', 'Almacén'");

console.log("hasNewMenu:", hasNewMenu);
console.log("hasOldMenu:", hasOldMenu);

// Si tiene el menu viejo, reemplazarlo
if (hasOldMenu) {
  c = c.replace(
    "['Electrodomésticos', 'Almacén', 'Limpieza', 'Moda', 'Electrónica', 'Hogar', 'Accesorios', 'Mascotas'].map((menuItem) => {",
    "departamentos.map((depto) => { const menuItem = depto.nombre;"
  );
}

// Reemplazar getCategoriesForMenu con version dinamica
const oldFnStart = "  const getCategoriesForMenu = (menuItem: string): string[] => {";
const idx = c.indexOf(oldFnStart);
if (idx !== -1) {
  // Encontrar el fin de la funcion - buscar "  };" que cierra la funcion
  let depth = 0;
  let i = idx;
  let fnEnd = -1;
  while (i < c.length) {
    if (c[i] === "{") depth++;
    if (c[i] === "}") {
      depth--;
      if (depth === 0) { fnEnd = i + 1; break; }
    }
    i++;
  }
  if (fnEnd !== -1) {
    const oldFn = c.substring(idx, fnEnd);
    const newFn = `  const getCategoriesForMenu = (menuItem: string): string[] => {
    const depto = departamentos?.find((d) => d.nombre === menuItem);
    if (depto && depto.categorias && depto.categorias.length > 0) {
      return depto.categorias.map((cat) => cat.nombre);
    }
    return [];
  }`;
    c = c.replace(oldFn, newFn);
    console.log("getCategoriesForMenu reemplazada OK");
  }
}

writeFileSync(file, c, "utf8");
console.log("Final check - departamentos.map:", c.includes("departamentos.map((depto)"));
