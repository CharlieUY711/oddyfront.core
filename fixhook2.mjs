import { readFileSync, writeFileSync } from "fs";
const file = "src/app/hooks/useProductos.ts";
let c = readFileSync(file, "utf8");

// Fix link corrupto
c = c.replace("[depts.map](http://depts.map)", "depts.map");

// Verificar
console.log("depts.map OK:", c.includes("depts.map(d =>") ? "✓" : "✗");
console.log("categorias OK:", c.includes('from("categorias")') ? "✓" : "✗");
console.log("deptsConCats OK:", c.includes("deptsConCats") ? "✓" : "✗");

writeFileSync(file, c, "utf8");
