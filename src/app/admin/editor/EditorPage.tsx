import { useRef, useState } from "react";
import { useEditorStore } from "./engine/useEditorStore";
import EditCanvas     from "./components/EditCanvas";
import PreviewCanvas  from "./components/PreviewCanvas";
import AdjustPanel    from "./components/AdjustPanel";
import TransformPanel from "./components/TransformPanel";
import EffectsPanel   from "./components/EffectsPanel";
import HistoryPanel   from "./components/HistoryPanel";
import ExportPanel    from "./components/ExportPanel";

const ACCENT = "#FF7A00";
const BLUE   = "#0F3460";
const GREEN  = "#1DC878";

type Tab = "adjust" | "transform" | "effects";

export default function EditorPage() {
  const store = useEditorStore();
  const editCanvasRef = useRef<HTMLCanvasElement>(null);
  const [tab, setTab] = useState<Tab>("adjust");
  const [renderCount, setRenderCount] = useState(0);

  const navBtn = (t: Tab, label: string, color: string) => (
    <button onClick={() => setTab(t)} style={{
      flex:1, padding:"8px 4px", background:"none", border:"none",
      borderBottom: tab === t ? `2px solid ${color}` : "2px solid transparent",
      color: tab === t ? color : "#9CA3AF",
      fontSize:"11px", fontWeight: tab === t ? 600 : 400,
      cursor:"pointer", transition:"all .12s"
    }}>{label}</button>
  );

  const topBtn = (label: string, onClick: () => void, color = ACCENT) => (
    <button onClick={onClick} style={{
      padding:"5px 14px", background:"none",
      border:`1.5px solid ${color}`, borderRadius:"7px",
      color, fontSize:"12px", fontWeight:500, cursor:"pointer",
    }}>{label}</button>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 110px)", minHeight:"500px", fontFamily:"DM Sans, sans-serif" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 16px", background:"#fff", border:"1.5px solid #E5E7EB", borderRadius:"12px", marginBottom:"5px", gap:"10px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
          <span style={{ fontWeight:700, fontSize:"14px", color:BLUE }}>Editor</span>
          <span style={{ width:"1px", height:"20px", background:"#E5E7EB" }} />
          {topBtn("Subir imagen", () => document.getElementById("emi-file-input")?.click(), ACCENT)}
          {topBtn("Undo", () => store.undo(), BLUE)}
          {topBtn("Redo", () => store.redo(), BLUE)}
          {topBtn("Reset", () => store.reset(), "#9CA3AF")}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
          {store.src && <span style={{ fontSize:"11px", color:"#9CA3AF" }}>{store.src.width}x{store.src.height}px</span>}
          {topBtn("Exportar", () => { const c=editCanvasRef.current; if(!c) return; const a=document.createElement("a"); a.href=c.toDataURL("image/png",0.9); a.download="export.png"; a.click(); }, GREEN)}
          {(["plus","minus","fit"]).map((l,i) => (
            <button key={i} onClick={() => { if(i===0) store.set("zoom",Math.min(store.zoom*1.25,5)); else if(i===1) store.set("zoom",Math.max(store.zoom/1.25,.1)); else store.set("zoom",1); }} style={{ padding:"4px 8px", border:"0.5px solid #E5E7EB", borderRadius:"6px", background:"#fff", color:"#6B7280", fontSize:"11px", cursor:"pointer" }}>{i===0?"+ ":i===1?"- ":"Fit"}</button>
          ))}
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"200px 1fr 1fr 180px", flex:1, overflow:"hidden" }}>
        <aside style={{ background:"#fff", border:"1.5px solid #E5E7EB", borderRadius:"12px", display:"flex", flexDirection:"column", overflow:"hidden", marginRight:"4px" }}>
          <div style={{ display:"flex", borderBottom:"1px solid #F3F4F6" }}>
            {navBtn("adjust","Ajustes",ACCENT)}
            {navBtn("transform","Forma",BLUE)}
            {navBtn("effects","FX",GREEN)}
          </div>
          <div style={{ flex:1, overflowY:"auto" }}>
            {tab==="adjust" && <AdjustPanel />}
            {tab==="transform" && <TransformPanel />}
            {tab==="effects" && <EffectsPanel />}
          </div>
          <div style={{ borderTop:"1px solid #F3F4F6" }}><HistoryPanel /></div>
        </aside>
        <div style={{ display:"flex", flexDirection:"column", background:"#F4F5F7", border:`1.5px solid ${ACCENT}`, borderRadius:"12px", overflow:"hidden", marginRight:"3px" }}>
          <div style={{ height:"32px", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 12px", borderBottom:"1px solid #E5E7EB", background:"#fff", flexShrink:0 }}>
            <span style={{ fontSize:"10px", color:"#9CA3AF" }}>{store.src ? `${store.src.width}x${store.src.height}` : "Sin imagen"}</span>
            <span style={{ fontSize:"10px", fontWeight:600, background:ACCENT, color:"#fff", padding:"2px 10px", borderRadius:"20px" }}>Edicion</span>
            <span style={{ fontSize:"10px", color:"#9CA3AF" }}>zoom {Math.round(store.zoom*100)}%</span>
          </div>
          <EditCanvas canvasRef={editCanvasRef} onRender={() => setRenderCount(n => n+1)} />
        </div>
        <div style={{ display:"flex", flexDirection:"column", background:"#F4F5F7", border:"1.5px solid #E5E7EB", borderRadius:"12px", overflow:"hidden", marginLeft:"3px" }}>
          <div style={{ height:"32px", display:"flex", alignItems:"center", justifyContent:"center", borderBottom:"1px solid #E5E7EB", background:"#fff", flexShrink:0 }}>
            <span style={{ fontSize:"10px", fontWeight:600, background:GREEN, color:"#fff", padding:"2px 10px", borderRadius:"20px" }}>Preview</span>
          </div>
          <PreviewCanvas sourceCanvasRef={editCanvasRef} />
          <div style={{ height:"28px", display:"flex", alignItems:"center", padding:"0 12px", borderTop:"1px solid #E5E7EB", background:"#fff", flexShrink:0 }}>
            <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:GREEN, display:"inline-block", marginRight:"3px" }} />
            <span style={{ fontSize:"10px", color:"#9CA3AF" }}>Sincronizado render {renderCount}</span>
          </div>
        </div>
        <aside style={{ background:"#fff", border:"1.5px solid #E5E7EB", borderRadius:"12px", display:"flex", flexDirection:"column", overflow:"hidden", marginLeft:"4px" }}>
          <ExportPanel />
          <div style={{ height:"1px", background:"#F3F4F6" }} />
          <div style={{ padding:"10px 12px" }}>
            <div style={{ fontSize:"10px", fontWeight:600, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:".08em", marginBottom:"8px" }}>Info</div>
            {store.src ? (
              <div style={{ fontSize:"11px", color:"#6B7280", lineHeight:2 }}>
                <div>Ancho: {store.src.width}px</div>
                <div>Alto: {store.src.height}px</div>
                <div>Zoom: {Math.round(store.zoom*100)}%</div>
                <div>Filtro: {store.filter}</div>
              </div>
            ) : <span style={{ fontSize:"11px", color:"#9CA3AF" }}>Sin imagen</span>}
          </div>
        </aside>
      </div>
    </div>
  );
}