import { useEditorStore } from "../engine/useEditorStore";

export default function HistoryPanel() {
  const { history, histIdx, undo, redo, reset } = useEditorStore();

  const btnStyle: React.CSSProperties = {
    flex:1, padding:"5px", border:"0.5px solid var(--color-border-secondary)",
    borderRadius:"6px", background:"var(--color-background-primary)",
    color:"var(--color-text-secondary)", fontSize:"10px", cursor:"pointer"
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
      <div style={{ padding:"10px 12px" }}>
        <div style={{ fontSize:"10px", fontWeight:500, color:"var(--color-text-secondary)", textTransform:"uppercase", letterSpacing:".08em", marginBottom:"8px" }}>
          Historial <span style={{ background:"rgba(255,122,0,.12)", color:"#FF7A00", fontSize:"9px", padding:"1px 5px", borderRadius:"4px", marginLeft:"4px" }}>{history.length}</span>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:"3px", maxHeight:"160px", overflowY:"auto" }}>
          {history.length === 0
            ? <span style={{ fontSize:"10px", color:"var(--color-text-secondary)" }}>Sin acciones</span>
            : [...history].reverse().map((h, i) => (
              <div key={i} style={{
                fontSize:"10px", padding:"3px 6px", borderRadius:"4px",
                background: i === 0 ? "rgba(255,122,0,.1)" : "transparent",
                color: i === 0 ? "#FF7A00" : "var(--color-text-secondary)"
              }}>{h.label}</div>
            ))
          }
        </div>
      </div>
      <div style={{ display:"flex", gap:"5px", padding:"0 12px 10px" }}>
        <button style={btnStyle} onClick={undo} disabled={histIdx <= 0}>↩ Undo</button>
        <button style={btnStyle} onClick={redo} disabled={histIdx >= history.length - 1}>Redo ↪</button>
        <button style={btnStyle} onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
