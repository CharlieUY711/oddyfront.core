import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401, headers: corsHeaders });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401, headers: corsHeaders });

    const { items } = await req.json();
    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: "items requeridos" }), { status: 400, headers: corsHeaders });
    }

    for (const item of items) {
      if (!item.product_id || !item.quantity || item.quantity <= 0) {
        return new Response(JSON.stringify({ error: "item invalido" }), { status: 400, headers: corsHeaders });
      }
    }

    const productIds = items.map(i => i.product_id);

    const { data: productosMarket } = await supabase
      .from("productos_market")
      .select("id, precio, estado")
      .in("id", productIds);

    const { data: productosSecondhand } = await supabase
      .from("productos_secondhand")
      .select("id, precio, estado")
      .in("id", productIds);

    const todosLosProductos = [...(productosMarket || []), ...(productosSecondhand || [])];
    const productosMap = new Map(todosLosProductos.map(p => [p.id, p]));

    for (const item of items) {
      const producto = productosMap.get(item.product_id);
      if (!producto) return new Response(JSON.stringify({ error: `Producto ${item.product_id} no encontrado` }), { status: 404, headers: corsHeaders });
      if (producto.estado !== "activo") return new Response(JSON.stringify({ error: `Producto ${item.product_id} no disponible` }), { status: 400, headers: corsHeaders });
    }

    const total = items.reduce((sum, item) => {
      const producto = productosMap.get(item.product_id);
      return sum + (producto.precio * item.quantity);
    }, 0);

    const { data: orden, error: ordenError } = await supabase
      .from("ordenes")
      .insert({ user_id: user.id, total_uyu: total, estado: "pendiente", created_at: new Date().toISOString() })
      .select()
      .single();

    if (ordenError) throw ordenError;

    const orderItems = items.map(item => ({
      order_id: orden.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: productosMap.get(item.product_id).precio,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
    if (itemsError) throw itemsError;

    return new Response(JSON.stringify({ order_id: orden.id, total }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "Error interno" }), {
      status: 500,
      headers: corsHeaders
    });
  }
});
