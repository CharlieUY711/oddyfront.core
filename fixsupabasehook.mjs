import { readFileSync, writeFileSync } from "fs";
const file = "src/app/hooks/useProductos.ts";
let c = readFileSync(file, "utf8");

if (!c.includes("supabase")) {
  c = c.replace(
    "import { fetchDepartamentos",
    "import { supabase } from '../../utils/supabase/client';\nimport { fetchDepartamentos"
  );
}

writeFileSync(file, c, "utf8");
console.log(c.includes("supabase") ? "OK" : "WARN");
