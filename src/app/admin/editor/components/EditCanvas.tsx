import { useRef, useEffect, useCallback } from "react";
import { useEditorStore } from "../engine/useEditorStore";
import { buildCSSFilter } from "../engine/filters";

interface Props {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onRender?: () => void;
}

export default function EditCanvas({ canvasRef, onRender }: Props) {
  const store   = useEditorStore();
  const wrapRef = useRef<HTMLDivElement>(null);
  const rafRef  = useRef<number | null>(null);

  const render = useCallback(() => {
    const src = store.src;
    const c   = canvasRef.current;
    const w   = wrapRef.current;
    if (!src || !c || !w) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const r   = store.fineRotation * Math.PI / 180;
      const cos = Math.abs(Math.cos(r)), sin = Math.abs(Math.sin(r));
      const rW  = src.width * cos + src.height * sin;
      const rH  = src.width * sin + src.height * cos;
      const maxW = w.clientWidth  - 24;
      const maxH = w.clientHeight - 24;
      const scale = Math.min(maxW / rW, maxH / rH, 1) * store.zoom;
      c.width  = Math.round(rW * scale);
      c.height = Math.round(rH * scale);
      const ctx = c.getContext("2d")!;
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.save();
      ctx.translate(c.width / 2, c.height / 2);
      if (store.flipH) ctx.scale(-1, 1);
      if (store.flipV) ctx.scale(1, -1);
      ctx.rotate(store.rotation * Math.PI / 180 + r);
      ctx.filter = buildCSSFilter(store);
      ctx.drawImage(src, -src.width * scale / 2, -src.height * scale / 2, src.width * scale, src.height * scale);
      ctx.restore();
      if (onRender) onRender();
    });
  }, [store, canvasRef, onRender]);

  useEffect(() => { render(); }, [
    store.src, store.brightness, store.contrast, store.exposure,
    store.saturation, store.temperature, store.tint, store.sharpness,
    store.blur, store.rotation, store.fineRotation,
    store.flipH, store.flipV, store.zoom, render
  ]);

  const loadFile = (f: File) => {
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload  = () => store.setSrc(img);
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(f);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) loadFile(f);
    e.target.value = "";
  };

  return (
    <div
      ref={wrapRef}
      style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", position:"relative", padding:"12px" }}
      onDragOver={e => { e.preventDefault(); e.currentTarget.style.outline = "2px dashed #FF7A00"; }}
      onDragLeave={e => { e.currentTarget.style.outline = ""; }}
      onDrop={e => {
        e.preventDefault();
        e.currentTarget.style.outline = "";
        const f = e.dataTransfer.files[0];
        if (f?.type.startsWith("image/")) loadFile(f);
      }}
    >
      {/* Canvas siempre montado para que el ref esté disponible */}
      <canvas
        ref={canvasRef}
        style={{ maxWidth:"100%", maxHeight:"100%", objectFit:"contain", borderRadius:"6px", display: store.src ? "block" : "none" }}
      />

      {/* Upload zone solo cuando no hay imagen */}
      {!store.src && (
        <div
          style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"12px", color:"#888", cursor:"pointer", position:"absolute" }}
          onClick={() => document.getElementById("emi-file-input")?.click()}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="3"/>
            <path d="m8 12 4-4 4 4M12 8v8"/>
          </svg>
          <p style={{ fontSize:"13px", textAlign:"center", lineHeight:1.6, color:"#888" }}>
            Arrastra o hace click<br/>para cargar una imagen
          </p>
          <button
            style={{ background:"#FF7A00", color:"#fff", border:"none", borderRadius:"8px", padding:"8px 20px", fontSize:"13px", fontWeight:500, cursor:"pointer" }}
            onClick={e => { e.stopPropagation(); document.getElementById("emi-file-input")?.click(); }}
          >
            Subir imagen
          </button>
        </div>
      )}

      {/* Input file global */}
      <input
        id="emi-file-input"
        type="file"
        accept="image/*"
        style={{ display:"none" }}
        onChange={handleFile}
      />
    </div>
  );
}