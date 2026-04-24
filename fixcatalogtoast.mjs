import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/admin/pages/AdminCatalog.tsx';
let c = readFileSync(file, 'utf8');

// Reemplazar import y uso de useToast con estado local
c = c.replace(
  "import { useToast } from \"../../components/ToastProvider\";",
  ""
);

c = c.replace(
  "  const toast = useToast();",
  `  const [toastMsg, setToastMsg] = useState<{text:string;type:"ok"|"err"} | null>(null);
  const toast = {
    success: (text: string) => { setToastMsg({text,type:"ok"}); setTimeout(()=>setToastMsg(null),3000); },
    error:   (text: string) => { setToastMsg({text,type:"err"}); setTimeout(()=>setToastMsg(null),3000); },
  };`
);

// Agregar toast visual despues del titulo
c = c.replace(
  "      {/* Tabs */}",
  `      {toastMsg && (
        <div style={{ padding:"0.75rem 1rem", borderRadius:"8px", fontSize:"0.85rem", fontWeight:600,
          background: toastMsg.type==="ok" ? "#f0fdf4" : "#fef2f2",
          color: toastMsg.type==="ok" ? "#166534" : "#dc2626",
          border: \`1px solid \${toastMsg.type==="ok" ? "#6BB87A" : "#ef4444"}\` }}>
          {toastMsg.type==="ok" ? "✅" : "❌"} {toastMsg.text}
        </div>
      )}
      {/* Tabs */}`
);

writeFileSync(file, c, 'utf8');
console.log('OK');
