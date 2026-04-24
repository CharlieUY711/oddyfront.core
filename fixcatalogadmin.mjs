import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/admin/pages/AdminCatalog.tsx';
let c = readFileSync(file, 'utf8');

// Agregar import useOutletContext
c = c.replace(
  'import { useState, useCallback } from "react";',
  'import { useState, useCallback } from "react";\nimport { useOutletContext } from "react-router";'
);

// Agregar isAdmin desde context
c = c.replace(
  '  const [tab, setTab] = useState<Tab>("tree");',
  '  const { isAdmin } = useOutletContext<any>() || {};\n  const [tab, setTab] = useState<Tab>("tree");'
);

writeFileSync(file, c, 'utf8');
console.log('OK');
