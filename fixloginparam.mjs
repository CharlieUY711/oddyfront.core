import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/OddyStorefront.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

// 1. Agregar useSearchParams import
const routerImportIdx = lines.findIndex(l => l.includes("from 'react-router'"));
console.log('router import en:', routerImportIdx, lines[routerImportIdx]);
lines[routerImportIdx] = lines[routerImportIdx].replace(
  "import { Link, useNavigate } from 'react-router';",
  "import { Link, useNavigate, useSearchParams } from 'react-router';"
);

// 2. Agregar useSearchParams y efecto despues de useNavigate
const navigateIdx = lines.findIndex(l => l.includes('const navigate = useNavigate()'));
lines.splice(navigateIdx + 1, 0,
  "  const [searchParams, setSearchParams] = useSearchParams();",
  "",
  "  useEffect(() => {",
  "    if (searchParams.get('login') === 'true') {",
  "      setShowLoginModal(true);",
  "    }",
  "  }, [searchParams]);",
  ""
);

// 3. Cambiar showLoginModal init a false simple
const loginModalIdx = lines.findIndex(l => l.includes('const [showLoginModal, setShowLoginModal] = useState'));
console.log('loginModal en:', loginModalIdx);
if (lines[loginModalIdx].includes('() =>')) {
  const endIdx = lines.findIndex((l, i) => i > loginModalIdx && l.includes('});'));
  lines.splice(loginModalIdx, endIdx - loginModalIdx + 1,
    "  const [showLoginModal, setShowLoginModal] = useState(false);"
  );
}

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
