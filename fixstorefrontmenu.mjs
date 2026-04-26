import { readFileSync, writeFileSync } from "fs";
const file = "src/app/public/OddyStorefront.tsx";
let c = readFileSync(file, "utf8");

// 1. Reemplazar array hardcodeado por departamentos de Supabase
c = c.replace(
  `{['Electrodomésticos', 'Almacén', 'Limpieza', 'Moda', 'Electrónica', 'Hogar', 'Accesorios', 'Mascotas'].map((menuItem) => {
            const categories = getCategoriesForMenu(menuItem);`,
  `{departamentos.map((depto: any) => {
            const menuItem = depto.nombre;
            const categories = getCategoriesForMenu(menuItem);`
);

// 2. Reemplazar getCategoriesForMenu completa para usar categorias de Supabase
const oldFn = `  const getCategoriesForMenu = (menuItem: string): string[] => {
    if (!departamentos || departamentos.length === 0) {
      // Fallback: categorías por defecto si no hay departamentos
      const defaultCategories: Record<string, string[]> = {
        'Electrodomésticos': ['Lavadoras', 'Refrigeradores', 'Microondas', 'Licuadoras', 'Aspiradoras'],
        'Almacén': ['Aceites', 'Conservas', 'Pastas', 'Arroz', 'Harinas'],
        'Limpieza': ['Detergentes', 'Lavandinas', 'Desinfectantes', 'Esponjas', 'Trapos'],
        'Moda': ['Ropa', 'Calzado', 'Bolsos', 'Accesorios', 'Relojes'],
        'Electrónica': ['Celulares', 'Tablets', 'Laptops', 'Auriculares', 'Cámaras'],
        'Hogar': ['Muebles', 'Decoración', 'Iluminación', 'Cortinas', 'Alfombras'],
        'Accesorios': ['Cargadores', 'Fundas', 'Cables', 'Soportes', 'Estuches'],
        'Mascotas': ['Alimento', 'Juguetes', 'Camas', 'Collares', 'Higiene']
      };
      return defaultCategories[menuItem] || [];
    }
    // Mapeo basado en nombres de departamentos
    const menuMapping: Record<string, string[]> = {
      'Electrodomésticos': ['Electro', 'Electrodomésticos'],
      'Almacén': ['Almacén'],
      'Limpieza': ['Limpieza'],
      'Moda': ['Moda'],
      'Electrónica': ['Electro', 'Celulares'],
      'Hogar': ['Hogar', 'Electro'],
      'Accesorios': ['Celulares', 'Electro'],
      'Mascotas': ['Mascotas']
    };
    const relatedNames = menuMapping[menuItem] || [];`;

if (c.includes(oldFn)) {
  // Necesitamos encontrar el fin de la funcion y reemplazar todo
  const start = c.indexOf(oldFn);
  // Buscar el cierre de la funcion (siguiente "  };" despues del start)
  const afterFn = c.indexOf("\n  };", start + oldFn.length);
  const oldFull = c.substring(start, afterFn + 4);
  
  const newFn = `  const getCategoriesForMenu = (menuItem: string): string[] => {
    // Usar categorias de Supabase directamente
    const depto = departamentos?.find((d: any) => d.nombre === menuItem);
    if (depto && (depto as any).categorias && (depto as any).categorias.length > 0) {
      return (depto as any).categorias.map((cat: any) => cat.nombre);
    }
    return [];
  };`;
  
  c = c.replace(oldFull, newFn);
  console.log("✓ getCategoriesForMenu reemplazada");
} else {
  console.log("✗ No se encontró getCategoriesForMenu");
}

// Verificar el reemplazo del menu
console.log("✓ menu usa departamentos:", c.includes("departamentos.map((depto: any)"));

writeFileSync(file, c, "utf8");
console.log("Done");
