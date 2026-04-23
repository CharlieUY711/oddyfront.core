import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  try {
    if (req.method !== "POST") return new Response("ok", { status: 200 });

    const body = await req.json().catch(() => ({}));

    // Solo procesar orders_v2
    if (body.topic !== "orders_v2") return new Response("ok", { status: 200 });

    const resourceId = body.resource?.split("/orders/")[1] || body.data?.id;
    if (!resourceId) return new Response("ok", { status: 200 });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // 1. Idempotencia — verificar si ya fue procesado
    const { data: existing } = await supabase
      .from("webhook_events")
      .select("id, processed")
      .eq("payment_id", String(resourceId))
      .eq("event_type", "ml_order")
      .single();

    if (existing?.processed) {
      console.log("[ml-webhook] Ya procesado:", resourceId);
      return new Response("ok", { status: 200 });
    }

    // 2. Registrar evento
    await supabase.from("webhook_events").upsert({
      payment_id: String(resourceId),
      event_type: "ml_order",
      payload:    body,
      processed:  false,
    }, { onConflict: "payment_id" });

    // 3. Obtener orden de ML
    const mlToken = Deno.env.get("ML_ACCESS_TOKEN")!;
    const mlRes = await fetch(`https://api.mercadolibre.com/orders/${resourceId}`, {
      headers: { "Authorization": `Bearer ${mlToken}` },
    });

    if (!mlRes.ok) {
      console.error("[ml-webhook] Error obteniendo orden ML:", resourceId);
      return new Response("ok", { status: 200 });
    }

    const mlOrder = await mlRes.json();
    if (mlOrder.status !== "paid") return new Response("ok", { status: 200 });

    // 4. Procesar items de la orden ML
    for (const item of mlOrder.order_items || []) {
      const mlItemId = item.item?.id;
      if (!mlItemId) continue;

      // 5. Mapear ml_item_id a product_id
      const { data: producto } = await supabase
        .from("productos_market")
        .select("id, stock")
        .eq("ml_item_id", mlItemId)
        .single();

      if (!producto) {
        console.error("[ml-webhook] Producto no encontrado para ml_item_id:", mlItemId);
        continue;
      }

      const quantity = item.quantity || 1;

      try {
        // 6. Verificar si ya existe orden interna para este recurso ML
        const { data: ordenExistente } = await supabase
          .from("ordenes")
          .select("id, payment_status")
          .eq("mp_payment_id", String(resourceId))
          .single();

        let orderId: string;

        if (!ordenExistente) {
          // 7. Crear orden interna
          const { data: nuevaOrden, error: ordenError } = await supabase
            .from("ordenes")
            .insert({
              user_id:        null,
              estado:         "pendiente",
              total_uyu:      mlOrder.total_amount || 0,
              payment_status: "pending_payment",
              mp_payment_id:  String(resourceId),
            })
            .select("id")
            .single();

          if (ordenError || !nuevaOrden) {
            console.error("[ml-webhook] Error creando orden:", ordenError);
            continue;
          }

          orderId = nuevaOrden.id;

          // Insertar order_item
          await supabase.from("order_items").insert({
            order_id:   orderId,
            product_id: producto.id,
            quantity,
            price:      item.unit_price || 0,
          });

        } else {
          orderId = ordenExistente.id;
          if (ordenExistente.payment_status === "paid") continue;
        }

        // 8. Descontar stock atomicamente
        await supabase.rpc("descontar_stock", {
          p_product_id: producto.id,
          p_quantity:   quantity,
        });

        // 9. Actualizar estado de la orden
        await supabase.rpc("update_order_status", {
          p_order_id:   orderId,
          p_new_status: "paid",
        });

        // 10. Log evento
        await supabase.rpc("log_event", {
          p_event_type:  "ml_order_processed",
          p_entity_type: "order",
          p_entity_id:   orderId,
          p_payload:     {
            ml_order_id: resourceId,
            ml_item_id:  mlItemId,
            product_id:  producto.id,
            quantity,
          },
        });

      } catch (itemError) {
        console.error("[ml-webhook] Error procesando item:", mlItemId, itemError);
      }
    }

    // 11. Marcar webhook como procesado
    await supabase.from("webhook_events")
      .update({ processed: true })
      .eq("payment_id", String(resourceId))
      .eq("event_type", "ml_order");

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("[ml-webhook] Error inesperado:", error);
    return new Response("ok", { status: 200 });
  }
});
