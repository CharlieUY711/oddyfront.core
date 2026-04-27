import { useEditorStore } from "../engine/useEditorStore";

export default function TransformPanel() {
  const { rotation, fineRotation, set, saveHistory } = useEditorStore();

  const rotate = (deg: number) => {
    const next = (rotation + deg + 360) % 360;
    set("rotation", next);
    saveHistory(`Rotar ${deg > 0 ? "+" : ""}${deg}°`);
  };

  const flip = (axis: "h"|"v") => {
    if (axis === "h") { set("flipH", !useEditorStore.getState().flipH); saveHistory("Flip H"); }
    else              { set("flipV", !useEditorStore.getState().flipV); saveHistory("Flip V"); }
  };

  const ASPECTS = ["Libre","1:1","4:5","16:9","9:16","3:2"];

  const btnStyle: React.CSSProperties = {
    padding:"7px", border:"0.5px solid var(--color-border-secondary)", borderRadius:"6px",
    background:"var(--color-background-primary)", color:"var(--color-text-secondary)",
    fontSize:"11px", cursor:"pointer", textAlign:"center" as const
  };

  return (
    <div>
      <div style={{ padding:"10px 12px", borderBottom:"0.5px solid var(--color-border-tertiary)" }}>
        <div style={{ fontSize:"10px", fontWeight:500, color:"var(--color-text-secondary)", textTransform:"uppercase", letterSpacing:".08em", marginBottom:"8px" }}>Rotación rápida</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"5px" }}>
          <button style={btnStyle} onClick={() => rotate(90)}>↻ 90°</button>
          <button style={btnStyle} onClick={() => rotate(-90)}>↺ -90°</button>
          <button style={btnStyle} onClick={() => flip("h")}>⟺ Horiz</button>
          <button style={btnStyle} onClick={() => flip("v")}>⟷ Vert</button>
        </div>
      </div>
      <div style={{ padding:"10px 12px", borderBottom:"0.5px solid var(--color-border-tertiary)" }}>
        <div style={{ fontSize:"10px", fontWeight:500, color:"var(--color-text-secondary)", textTransform:"uppercase", letterSpacing:".08em", marginBottom:"8px" }}>Ángulo libre</div>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:"11px", color:"var(--color-text-secondary)", marginBottom:"3px" }}>
          <span>Ángulo</span><span style={{ fontWeight:500, color:"var(--color-text-primary)" }}>{fineRotation}°</span>
        </div>
        <input type="range" min="-45" max="45" value={fineRotation} style={{ width:"100%", height:"3px", accentColor:"#FF7A00" }}
          onChange={e => { set("fineRotation", parseInt(e.target.value)); saveHistory(`Ángulo: ${e.target.value}°`); }} />
      </div>
      <div style={{ padding:"10px 12px" }}>
        <div style={{ fontSize:"10px", fontWeight:500, color:"var(--color-text-secondary)", textTransform:"uppercase", letterSpacing:".08em", marginBottom:"8px" }}>Aspecto</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"5px" }}>
          {ASPECTS.map(a => (
            <button key={a} style={btnStyle} onClick={() => saveHistory("Aspecto: "+a)}>{a}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
