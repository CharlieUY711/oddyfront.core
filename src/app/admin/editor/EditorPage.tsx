import { useRef, useState } from "react";
import { useEditorStore } from "./engine/useEditorStore";
import EditCanvas    from "./components/EditCanvas";
import PreviewCanvas from "./components/PreviewCanvas";
import AdjustPanel   from "./components/AdjustPanel";
import TransformPanel from "./components/TransformPanel";
import EffectsPanel  from "./components/EffectsPanel";
import HistoryPanel  from "./components/HistoryPanel";
import ExportPanel   from "./components/ExportPanel";

const ACCENT = "#FF7A00";
const SIDEBAR_BG = "#0F3460";

type Tab = "adjust" | "transform" | "effects";

export default function EditorPage() {
  const store = useEditorStore();
  const editCanvasRef = useRef<HTMLCanvasElement>(null);
  const [tab, setTab] = useState<Tab>("adjust");
  const [renderCount, setRenderCount] = useState(0);

  const navItem = (t: Tab, label: string) => (
    <button onClick={() => setTab(t)} style={{
      flex:1, padding:"8px 4px", background:"none", border:"none",
      borderBottom: tab === t ? `2px solid ${ACCENT}` : "2px solid transparent", color: tab === t ? ACCENT : "#6B7280",
      fontSize:"11px", fontWeight: tab === t ? 500 : 400, cursor:"pointer",
      transition:"all .12s"
    }}>{label}</button>
  );

  const zoomBtn = (label: string, action: () => void) => (
    <button onClick={action} style={{ background:"none", border:"0.5px solid #333", borderRadius:"4px", color:"#888", fontSize:"10px", padding:"2px 7px", cursor:"pointer" }}>{label}</button>
  );

  return (
    <div style={{ display:"grid", gridTemplateColumns:"200px 1fr 1fr 180px", height:"calc(100vh - 140px)", minHeight:"500px", border:"0.5px solid var(--color-border-tertiary)", borderRadius:"var(--border-radius-lg)", overflow:"hidden", fontFamily:"DM Sans, sans-serif" }}>

      {/* ── Panel izquierdo ── */}
      <aside style={{ background: "#fff", display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ display:"flex", borderBottom:"0.5px solid rgba(255,255,255,0.08)" }}>
          {navItem("adjust","Ajustes")}
          {navItem("transform","Forma")}
          {navItem("effects","FX")}
        </div>
        <div style={{ flex:1, overflowY:"auto" }}>
          {tab === "adjust"    && <div style={{ color:"var(--color-text-primary)" }}><AdjustPanel /></div>}
          {tab === "transform" && <div style={{ color:"var(--color-text-primary)" }}><TransformPanel /></div>}
          {tab === "effects"   && <div style={{ color:"var(--color-text-primary)" }}><EffectsPanel /></div>}
        </div>
        <div style={{ borderTop:"0.5px solid #E5E7EB" }}>
          <HistoryPanel />
        </div>
      </aside>

      {/* ── Canvas edición ── */}
      <div style={{ display:"flex", flexDirection:"column", background:"#F1F3F5", borderRight:`1.5px solid ${ACCENT}`, margin:"12px 6px 12px 12px", borderRadius:"12px", overflow:"hidden" }}>
        <div style={{ height:"28px", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 10px", borderBottom:"0.5px solid #E5E7EB", flexShrink:0, background:"#fff", borderRadius:"12px 12px 0 0" }}>
          <span style={{ fontSize:"10px", color:"#888" }}>
            {store.src ? `${store.src.width}×${store.src.height}` : "Sin imagen"}
          </span>
          <span style={{ fontSize:"10px", fontWeight:500, background:"rgba(255,122,0,.8)", color:"#fff", padding:"2px 8px", borderRadius:"20px" }}>Edición</span>
          <div style={{ display:"flex", gap:"4px" }}>
            {zoomBtn("+", () => store.set("zoom", Math.min(store.zoom * 1.25, 5)))}
            {zoomBtn("−", () => store.set("zoom", Math.max(store.zoom / 1.25, .1)))}
            {zoomBtn("Fit", () => store.set("zoom", 1))}
          </div>
        </div>
        <EditCanvas
          canvasRef={editCanvasRef}
          onRender={() => setRenderCount(n => n + 1)}
        />
      </div>

      {/* ── Canvas preview ── */}
      <div style={{ display:"flex", flexDirection:"column", background:"#F1F3F5", margin:"12px 12px 12px 6px", borderRadius:"12px", overflow:"hidden" }}>
        <div style={{ height:"28px", display:"flex", alignItems:"center", justifyContent:"center", padding:"0 10px", borderBottom:"0.5px solid #E5E7EB", flexShrink:0, background:"#fff", borderRadius:"12px 12px 0 0" }}>
          <span style={{ fontSize:"10px", fontWeight:500, background:"rgba(30,200,120,.8)", color:"#fff", padding:"2px 8px", borderRadius:"20px" }}>Preview</span>
        </div>
        <PreviewCanvas sourceCanvasRef={editCanvasRef} />
        <div style={{ height:"28px", display:"flex", alignItems:"center", padding:"0 10px", borderTop:"0.5px solid #E5E7EB", flexShrink:0, background:"#fff" }}>
          <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#1DC878", display:"inline-block", marginRight:"6px" }} />
          <span style={{ fontSize:"10px", color:"#888" }}>Sincronizado · render #{renderCount}</span>
        </div>
      </div>

      {/* ── Panel derecho ── */}
      <aside style={{ background: "#fff", display:"flex", flexDirection:"column", overflow:"hidden", borderLeft:"0.5px solid rgba(255,255,255,0.08)" }}>
        <div style={{ flex:1, overflowY:"auto" }}>
          <ExportPanel />
          <div style={{ height:"0.5px", background:"#E5E7EB" }} />
          <div style={{ padding:"10px 12px" }}>
            <div style={{ fontSize:"10px", fontWeight:500, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:".08em", marginBottom:"8px" }}>Info</div>
            {store.src ? (
              <div style={{ fontSize:"10px", color:"#6B7280", lineHeight:2 }}>
                <div>Ancho: {store.src.width}px</div>
                <div>Alto: {store.src.height}px</div>
                <div>Zoom: {Math.round(store.zoom * 100)}%</div>
                <div>Filtro: {store.filter}</div>
                {store.bgRemoved && <div style={{ color:"#6B3CFF" }}>✦ Fondo removido</div>}
              </div>
            ) : (
              <span style={{ fontSize:"10px", color:"rgba(255,255,255,0.3)" }}>Sin imagen</span>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
