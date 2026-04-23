import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/CheckoutPage.tsx';
let c = readFileSync(file, 'utf8');
const lines = c.split('\r\n');

// Agregar estados payLoading y payError despues de step
const stepIdx = lines.findIndex(l => l.includes("const [step, setStep]"));
lines.splice(stepIdx + 1, 0,
  "  const [payLoading, setPayLoading] = useState(false);",
  "  const [payError, setPayError] = useState(\"\");"
);

// Reemplazar handlePagar
const pagarIdx = lines.findIndex(l => l.includes("const handlePagar = async"));
const pagarEnd = lines.findIndex((l, i) => i > pagarIdx && l.trim() === "};");
lines.splice(pagarIdx, pagarEnd - pagarIdx + 1,
  "  const handlePagar = async () => {",
  "    setPayLoading(true);",
  "    setPayError(\"\");",
  "    try {",
  "      const { data: { session } } = await supabase.auth.getSession();",
  "      const res = await fetch(\"https://pukbgsgrtjqprijpecob.supabase.co/functions/v1/create_preference\", {",
  "        method: \"POST\",",
  "        headers: { \"Content-Type\": \"application/json\", \"Authorization\": `Bearer ${session?.access_token}` },",
  "        body: JSON.stringify({ order_id: orderId }),",
  "      });",
  "      const data = await res.json();",
  "      if (!res.ok) throw new Error(data.error || \"Error en MercadoPago\");",
  "      window.location.href = data.init_point;",
  "    } catch (err) {",
  "      setPayError(err.message || \"Error al iniciar el pago\");",
  "      setPayLoading(false);",
  "    }",
  "  };"
);

writeFileSync(file, lines.join('\r\n'), 'utf8');
console.log('OK');
