/* =====================================================
   Checkout Page — Con selector de moneda UYU/USD
   ODDY Marketplace
   ===================================================== */
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { getCarrito, vaciarCarrito, type CarritoItem } from "../services/carritoApi";
import { getTipoCambioUSD, formatearPrecio, convertirUYUaUSD, convertirUSDaUYU, type TipoCambio } from "../services/bcuApi";
import { supabase } from "../../utils/supabase/client";

interface CarritoItemConMoneda extends CarritoItem {
  nombre?: string;
  imagen?: string;
  moneda_item?: "UYU" | "USD";
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<CarritoItemConMoneda[]>([]);
  const [tipoCambio, setTipoCambio] = useState<TipoCambio | null>(null);
  const [monedaPago, setMonedaPago] = useState<"UYU" | "USD">("UYU");
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [carritoData, tc] = await Promise.all([
          getCarrito(),
          getTipoCambioUSD(),
        ]);
        setItems(carritoData);
        setTipoCambio(tc);

        // Determinar moneda dominante
        const totalUYU = carritoData
          .filter(i => (i.moneda || "UYU") === "UYU")
          .reduce((s, i) => s + i.precio_unitario * i.cantidad, 0);
        const totalUSD = carritoData
          .filter(i => (i.moneda || "UYU") === "USD")
          .reduce((s, i) => s + i.precio_unitario * i.cantidad, 0);
        const totalUSDenUYU = totalUSD * (tc?.venta || 44);
        setMonedaPago(totalUSDenUYU > totalUYU ? "USD" : "UYU");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Calcular totales
  const calcularTotalUYU = () => {
    if (!tipoCambio) return 0;
    return items.reduce((s, i) => {
      const moneda = (i.moneda || "UYU") as "UYU" | "USD";
      const precio = moneda === "USD"
        ? convertirUSDaUYU(i.precio_unitario, tipoCambio)
        : i.precio_unitario;
      return s + precio * i.cantidad;
    }, 0);
  };

  const calcularTotalUSD = () => {
    if (!tipoCambio) return 0;
    return items.reduce((s, i) => {
      const moneda = (i.moneda || "UYU") as "UYU" | "USD";
      const precio = moneda === "UYU"
        ? convertirUYUaUSD(i.precio_unitario, tipoCambio)
        : i.precio_unitario;
      return s + precio * i.cantidad;
    }, 0);
  };

  const totalMostrado = monedaPago === "UYU" ? calcularTotalUYU() : calcularTotalUSD();
  const iva = monedaPago === "UYU" ? totalMostrado * 0.22 : totalMostrado * 0.22;
  const totalConIva = totalMostrado + iva;

  const getPrecioItem = (item: CarritoItemConMoneda) => {
    if (!tipoCambio) return formatearPrecio(item.precio_unitario, "UYU");
    const monedaItem = (item.moneda || "UYU") as "UYU" | "USD";
    if (monedaPago === monedaItem) {
      return formatearPrecio(item.precio_unitario * item.cantidad, monedaItem);
    }
    if (monedaPago === "UYU") {
      return formatearPrecio(convertirUSDaUYU(item.precio_unitario * item.cantidad, tipoCambio), "UYU");
    }
    return formatearPrecio(convertirUYUaUSD(item.precio_unitario * item.cantidad, tipoCambio), "USD");
  };

  const handleConfirmar = async () => {
    if (!nombre || !email) {
      alert("Por favor completá nombre y email");
      return;
    }
    setProcesando(true);
    try {
      const { data, error } = await supabase
        .from("ordenes")
        .insert({
          nombre_cliente: nombre,
          email_cliente: email,
          telefono_cliente: telefono,
          direccion_entrega: direccion,
          moneda: monedaPago,
          tipo_cambio: tipoCambio?.venta,
          total_uyu: calcularTotalUYU(),
          total_usd: calcularTotalUSD(),
          estado: "pendiente",
          items: items.map(i => ({
            producto_id: i.producto_id,
            producto_tipo: i.producto_tipo,
            cantidad: i.cantidad,
            precio_unitario: i.precio_unitario,
            moneda: i.moneda || "UYU",
          })),
        })
        .select()
        .single();

      if (error) throw error;
      await vaciarCarrito();
      navigate(`/orden/${data.id}`);
    } catch (err) {
      console.error(err);
      alert("Error procesando la orden. Intentá de nuevo.");
    } finally {
      setProcesando(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", fontSize: "1.2rem" }}>Cargando checkout...</div>
    </div>
  );

  if (items.length === 0) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem" }}>
      <div style={{ fontSize: "3rem" }}>🛒</div>
      <h2>Tu carrito está vacío</h2>
      <Link to="/" style={{ color: "#FF6835", textDecoration: "none", fontWeight: 600 }}>← Volver a la tienda</Link>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAFAFA", fontFamily: "DM Sans, sans-serif" }}>
      {/* Header */}
      <header style={{ background: "#FF6835", padding: "1rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/" style={{ textDecoration: "none", color: "#fff", fontSize: "1rem", fontWeight: 600 }}>← Volver</Link>
        <h1 style={{ margin: 0, color: "#fff", fontSize: "1.25rem", fontWeight: 700 }}>Checkout</h1>
        <div style={{ width: 80 }} />
      </header>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem", display: "grid", gridTemplateColumns: "1fr 420px", gap: "2rem" }}>

        {/* Formulario */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* Selector de moneda */}
          <div style={{ background: "#fff", borderRadius: "12px", padding: "1.5rem" }}>
            <h2 style={{ margin: "0 0 1rem 0", fontSize: "1.1rem", fontWeight: 700 }}>Moneda de pago</h2>
            {tipoCambio && (
              <p style={{ margin: "0 0 1rem 0", fontSize: "0.85rem", color: "#888" }}>
                Tipo de cambio BCU: U$S 1 = $U {tipoCambio.venta.toLocaleString("es-UY")} (venta)
              </p>
            )}
            <div style={{ display: "flex", gap: "1rem" }}>
              {(["UYU", "USD"] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setMonedaPago(m)}
                  style={{
                    flex: 1, padding: "0.75rem", borderRadius: "8px", fontWeight: 700, fontSize: "1rem", cursor: "pointer",
                    border: monedaPago === m ? "2px solid #FF6835" : "2px solid #E5E7EB",
                    background: monedaPago === m ? "#FFF3EF" : "#fff",
                    color: monedaPago === m ? "#FF6835" : "#666",
                    transition: "all 0.2s",
                  }}
                >
                  {m === "UYU" ? "$U Pesos" : "U$S Dólares"}
                </button>
              ))}
            </div>
          </div>

          {/* Datos del cliente */}
          <div style={{ background: "#fff", borderRadius: "12px", padding: "1.5rem" }}>
            <h2 style={{ margin: "0 0 1rem 0", fontSize: "1.1rem", fontWeight: 700 }}>Tus datos</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                { label: "Nombre completo *", value: nombre, set: setNombre, type: "text", placeholder: "Juan García" },
                { label: "Email *", value: email, set: setEmail, type: "email", placeholder: "juan@email.com" },
                { label: "Teléfono", value: telefono, set: setTelefono, type: "tel", placeholder: "099 123 456" },
                { label: "Dirección de entrega", value: direccion, set: setDireccion, type: "text", placeholder: "Av. 18 de Julio 1234, Montevideo" },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#444", marginBottom: "0.25rem" }}>{f.label}</label>
                  <input
                    type={f.type}
                    value={f.value}
                    onChange={e => f.set(e.target.value)}
                    placeholder={f.placeholder}
                    style={{
                      width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1.5px solid #E5E7EB",
                      fontSize: "1rem", outline: "none", boxSizing: "border-box",
                      fontFamily: "DM Sans, sans-serif",
                    }}
                    onFocus={e => e.target.style.borderColor = "#FF6835"}
                    onBlur={e => e.target.style.borderColor = "#E5E7EB"}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resumen */}
        <div style={{ position: "sticky", top: "2rem", height: "fit-content", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ background: "#fff", borderRadius: "12px", padding: "1.5rem" }}>
            <h2 style={{ margin: "0 0 1rem 0", fontSize: "1.1rem", fontWeight: 700 }}>Resumen del pedido</h2>

            {/* Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1rem" }}>
              {items.map(item => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{ fontSize: "0.9rem", color: "#444", flex: 1 }}>
                    {item.producto_tipo === "market" ? "🛍" : "♻️"} x{item.cantidad}
                    <span style={{ marginLeft: "0.25rem", fontSize: "0.8rem", color: "#888" }}>#{item.producto_id.substring(0, 8)}</span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#222", flexShrink: 0 }}>
                    {getPrecioItem(item)}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#888", fontSize: "0.9rem" }}>
                <span>Subtotal</span>
                <span>{formatearPrecio(totalMostrado, monedaPago)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#888", fontSize: "0.9rem" }}>
                <span>IVA (22%)</span>
                <span>{formatearPrecio(iva, monedaPago)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#888", fontSize: "0.9rem" }}>
                <span>Envío</span>
                <span style={{ color: "#6BB87A", fontWeight: 600 }}>Gratis</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem", fontWeight: 800, color: "#222", marginTop: "0.5rem", paddingTop: "0.5rem", borderTop: "2px solid #E5E7EB" }}>
                <span>Total</span>
                <span style={{ color: "#FF6835" }}>{formatearPrecio(totalConIva, monedaPago)}</span>
              </div>
              {tipoCambio && (
                <div style={{ fontSize: "0.75rem", color: "#aaa", textAlign: "right" }}>
                  ≈ {monedaPago === "UYU"
                    ? formatearPrecio(convertirUYUaUSD(totalConIva, tipoCambio), "USD")
                    : formatearPrecio(convertirUSDaUYU(totalConIva, tipoCambio), "UYU")}
                </div>
              )}
            </div>

            <button
              onClick={handleConfirmar}
              disabled={procesando}
              style={{
                width: "100%", padding: "1rem", marginTop: "1.25rem",
                background: procesando ? "#ccc" : "#FF6835",
                color: "#fff", border: "none", borderRadius: "8px",
                fontSize: "1rem", fontWeight: 700, cursor: procesando ? "not-allowed" : "pointer",
                transition: "opacity 0.2s",
              }}
            >
              {procesando ? "Procesando..." : `Confirmar pedido · ${formatearPrecio(totalConIva, monedaPago)}`}
            </button>

            <Link to="/carrito" style={{ display: "block", textAlign: "center", color: "#888", textDecoration: "none", fontSize: "0.85rem", marginTop: "0.75rem" }}>
              ← Volver al carrito
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
