import { readFileSync, writeFileSync } from 'fs';
const file = 'src/app/public/CheckoutPage.tsx';
let c = readFileSync(file, 'utf8');

c = c.replace(
  `const { data, error } = await supabase.from("ordenes").insert({
        nombre_cliente: nombre, email_cliente: email,
        telefono_cliente: telefono, direccion_entrega: direccion,
        moneda: monedaPago, tipo_cambio: tipoCambio?.venta,
        total_uyu: calcularTotalUYU(), total_usd: calcularTotalUSD(),
        estado: "pendiente",
        user_id: (await supabase.auth.getUser()).data.user?.id,
        items: items.map(i => ({ producto_id: i.producto_id, producto_tipo: i.producto_tipo, cantidad: i.cantidad, precio_unitario: i.precio_unitario, moneda: i.moneda || "UYU" })),
      }).select().single();
      if (error) throw error;`,
  `const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(\`https://pukbgsgrtjqprijpecob.supabase.co/functions/v1/crear-orden\`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": \`Bearer \${session?.access_token}\` },
        body: JSON.stringify({ items: items.map(i => ({ product_id: i.producto_id, quantity: i.cantidad })) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error creando orden");`
);

writeFileSync(file, c, 'utf8');
console.log('OK');
