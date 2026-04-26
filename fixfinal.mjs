import { readFileSync, writeFileSync } from "fs";

// Fix OddyStorefront.tsx
const file1 = "src/app/public/OddyStorefront.tsx";
let c1 = readFileSync(file1, "utf8");
c1 = c1.split("[departamentos.map](http://departamentos.map)").join("departamentos.map");
c1 = c1.split("[categorias.map](http://categorias.map)").join("categorias.map");
c1 = c1.split("[depts.map](http://depts.map)").join("depts.map");
c1 = c1.split("[d.id](http://d.id)").join("d.id");
writeFileSync(file1, c1, "utf8");
console.log("Storefront - departamentos.map OK:", c1.includes("departamentos.map((depto"));

// Fix useProductos.ts
const file2 = "src/app/hooks/useProductos.ts";
let c2 = readFileSync(file2, "utf8");
c2 = c2.split("[departamentos.map](http://departamentos.map)").join("departamentos.map");
c2 = c2.split("[depts.map](http://depts.map)").join("depts.map");
c2 = c2.split("[d.id](http://d.id)").join("d.id");
writeFileSync(file2, c2, "utf8");
console.log("Hook - depts.map OK:", c2.includes("depts.map(d =>"));

// Verificar sin corruption
console.log("Storefront limpio:", !c1.includes("http://departamentos") ? "SI" : "NO");
console.log("Hook limpio:", !c2.includes("http://depts") ? "SI" : "NO");
