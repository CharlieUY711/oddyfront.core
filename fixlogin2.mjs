import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

// 1. Agregar useSearchParams al import (linea 7, index 6)
lines[6] = "import { Link, useNavigate, useSearchParams } from 'react-router';";

// 2. Agregar useSearchParams hook despues de navigate en el componente principal (linea 2565, index 2564)
lines.splice(2565, 0, "  const [searchParams, setSearchParams] = useSearchParams();");

// 3. Simplificar showLoginModal init (ahora en linea 2576 por el splice)
const loginIdx = lines.findIndex(l => l.includes("const [showLoginModal, setShowLoginModal] = useState"));
console.log("loginModal en:", loginIdx, lines[loginIdx]);
// Reemplazar las lineas del useState con funcion por useState simple
const endIdx = lines.findIndex((l, i) => i > loginIdx && l.includes("});"));
console.log("end en:", endIdx);
lines.splice(loginIdx, endIdx - loginIdx + 1, "  const [showLoginModal, setShowLoginModal] = useState(false);");

// 4. Agregar useEffect para abrir modal si ?login=true
const newLoginIdx = lines.findIndex(l => l.includes("const [showLoginModal, setShowLoginModal] = useState(false)"));
lines.splice(newLoginIdx + 1, 0,
  "",
  "  useEffect(() => {",
  "    if (searchParams.get('login') === 'true') {",
  "      setShowLoginModal(true);",
  "    }",
  "  }, [searchParams]);"
);

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
