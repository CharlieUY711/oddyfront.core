import { useSearchParams, Link } from "react-router";

export default function PendingPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("external_reference");

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1.5rem", backgroundColor: "#fffbeb", fontFamily: "DM Sans, sans-serif" }}>
      <div style={{ fontSize: "4rem" }}>⏳</div>
      <h1 style={{ margin: 0, color: "#92400e", fontSize: "1.75rem", fontWeight: 800 }}>Pago pendiente</h1>
      <p style={{ margin: 0, color: "#888", fontSize: "1rem" }}>Tu pago está siendo procesado. Te notificaremos cuando se confirme.</p>
      {orderId && (
        <Link to={`/orden/${orderId}?status=pending`} style={{ padding: "0.75rem 1.5rem", background: "#FF6835", color: "#fff", textDecoration: "none", borderRadius: "8px", fontWeight: 700 }}>
          Ver mi orden
        </Link>
      )}
      <Link to="/" style={{ color: "#FF6835", fontWeight: 700, textDecoration: "none" }}>← Volver a la tienda</Link>
    </div>
  );
}
