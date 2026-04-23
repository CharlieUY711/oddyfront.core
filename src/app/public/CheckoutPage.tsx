import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { getCarrito, vaciarCarrito, type CarritoItem } from "../services/carritoApi";
import { getTipoCambioUSD, formatearPrecio, convertirUYUaUSD, convertirUSDaUYU, type TipoCambio } from "../services/bcuApi";
import { supabase } from "../../utils/supabase/client";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [items, setItems] = useState([]);
  const [tipoCambio, setTipoCambio] = useState(null);
  const [monedaPago, setMonedaPago] = useState("UYU");
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/?login=true&redirect=/checkout");
      } else {
        setAuthChecked(true);
        setEmail(session.user.email || "");
      }
    });
  }, []);

  useEffect(() => {
    if (!authChecked) return;
    async function load() {
      try {
        const [carritoData, tc] = await Promise.all([getCarrito(), getTipoCambioUSD()]);
        setItems(carritoData);
        setTipoCambio(tc);
        const totalUYU = carritoData.filter(i => (i.moneda || "UYU") === "UYU").reduce((s, i) => s + i.precio_unitario * i.cantidad, 0);
        const totalUSD = carritoData.filter(i => (i.moneda || "UYU") === "USD").reduce((s, i) => s + i.precio_unitario * i.cantidad, 0);
        setMonedaPago(totalUSD * (tc?.venta || 44) > totalUYU ? "USD" : "UYU");
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, [authChecked]);

  const calcularTotalUYU = () => {
    if (!tipoCambio) return 0;
    return items.reduce((s, i) => {
      const moneda = i.moneda || "UYU";
      const precio = moneda === "USD" ? convertirUSDaUYU(i.precio_unitario, tipoCambio) : i.precio_unitario;
      return s + precio * i.cantidad;
    }, 0);
  };

  const calcularTotalUSD = () => {
    if (!tipoCambio) return 0;
    return items.reduce((s, i) => {
      const moneda = i.moneda || "UYU";
      const precio = moneda === "UYU" ? convertirUYUaUSD(i.precio_unitario, tipoCambio) : i.precio_unitario;
      return s + precio * i.cantidad;
    }, 0);
  };

  const totalMostrado = monedaPago === "UYU" ? calcularTotalUYU() : calcularTotalUSD();
  const iva = totalMostrado * 0.22;
  const totalConIva = totalMostrado + iva;

  const handleConfirmar = async () => {
    if (!nombre || !email) { alert("Por favor completá nombre y email"); return; }
    setProcesando(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`https://pukbgsgrtjqprijpecob.supabase.co/functions/v1/crear-orden`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${session?.access_token}` },
        body: JSON.stringify({ items: items.map(i => ({ product_id: i.producto_id, quantity: i.cantidad })) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error creando orden");
      await vaciarCarrito();
      navigate(`/orden/${data.id}`);
    } catch (err) { console.error(err); alert("Error procesando la orden."); }
    finally { setProcesando(false); }
  };

  if (!authChecked || loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", color: "#666" }}>
      {!authChecked ? "Verificando sesión..." : "Cargando checkout..."}
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
      <header style={{ background: "#FF6835", padding: "1rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/" style={{ textDecoration: "none", color: "#fff", fontWeight: 600 }}>← Volver</Link>
        <h1 style={{ margin: 0, color: "#fff", fontSize: "1.25rem", fontWeight: 700 }}>Checkout</h1>
        <div style={{ width: 80 }} />
      </header>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem", display: "grid", gridTemplateColumns: "1fr 420px", gap: "2rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ background: "#fff", borderRadius: "12px", padding: "1.5rem" }}>
            <h2 style={{ margin: "0 0 1rem 0", fontSize: "1.1rem", fontWeight: 700 }}>Moneda de pago</h2>
            {tipoCambio && <p style={{ margin: "0 0 1rem 0", fontSize: "0.85rem", color: "#888" }}>Tipo de cambio BCU: U$S 1 = $U {tipoCambio.venta.toLocaleString("es-UY")} (venta)</p>}
            <div style={{ display: "flex", gap: "1rem" }}>
              {["UYU", "USD"].map(m => (
                <button key={m} onClick={() => setMonedaPago(m)} style={{ flex: 1, padding: "0.75rem", borderRadius: "8px", fontWeight: 700, fontSize: "1rem", cursor: "pointer", border: monedaPago === m ? "2px solid #FF6835" : "2px solid #E5E7EB", background: monedaPago === m ? "#FFF3EF" : "#fff", color: monedaPago === m ? "#FF6835" : "#666" }}>
                  {m === "UYU" ? "$U Pesos" : "U$S Dólares"}
                </button>
              ))}
            </div>
          </div>
          <div style={{ background: "#fff", borderRadius: "12px", padding: "1.5rem" }}>
            <h2 style={{ margin: "0 0 1rem 0", fontSize: "1.1rem", fontWeight: 700 }}>Tus datos</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                { label: "Nombre completo *", value: nombre, set: setNombre, type: "text", placeholder: "Juan García" },
                { label: "Email *", value: email, set: setEmail, type: "email", placeholder: "juan@email.com" },
                { label: "Teléfono", value: telefono, set: setTelefono, type: "tel", placeholder: "099 123 456" },
                { label: "Dirección de entrega", value: direccion, set: setDireccion, type: "text", placeholder: "Av. 18 de Julio 1234" },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#444", marginBottom: "0.25rem" }}>{f.label}</label>
                  <input type={f.type} value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1.5px solid #E5E7EB", fontSize: "1rem", outline: "none", boxSizing: "border-box" }} onFocus={e => e.target.style.borderColor = "#FF6835"} onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ position: "sticky", top: "2rem", height: "fit-content" }}>
          <div style={{ background: "#fff", borderRadius: "12px", padding: "1.5rem" }}>
            <h2 style={{ margin: "0 0 1rem 0", fontSize: "1.1rem", fontWeight: 700 }}>Resumen</h2>
            <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#888", fontSize: "0.9rem" }}>
                <span>Subtotal</span><span>{formatearPrecio(totalMostrado, monedaPago)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#888", fontSize: "0.9rem" }}>
                <span>IVA (22%)</span><span>{formatearPrecio(iva, monedaPago)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#888", fontSize: "0.9rem" }}>
                <span>Envío</span><span style={{ color: "#6BB87A", fontWeight: 600 }}>Gratis</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem", fontWeight: 800, color: "#222", marginTop: "0.5rem", paddingTop: "0.5rem", borderTop: "2px solid #E5E7EB" }}>
                <span>Total</span><span style={{ color: "#FF6835" }}>{formatearPrecio(totalConIva, monedaPago)}</span>
              </div>
            </div>
            <button onClick={handleConfirmar} disabled={procesando} style={{ width: "100%", padding: "1rem", marginTop: "1.25rem", background: procesando ? "#ccc" : "#FF6835", color: "#fff", border: "none", borderRadius: "8px", fontSize: "1rem", fontWeight: 700, cursor: procesando ? "not-allowed" : "pointer" }}>
              {procesando ? "Procesando..." : `Confirmar · ${formatearPrecio(totalConIva, monedaPago)}`}
            </button>
            <Link to="/carrito" style={{ display: "block", textAlign: "center", color: "#888", textDecoration: "none", fontSize: "0.85rem", marginTop: "0.75rem" }}>← Volver al carrito</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
