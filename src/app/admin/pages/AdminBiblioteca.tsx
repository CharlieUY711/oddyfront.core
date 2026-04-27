import { useState, useEffect, useRef, useCallback } from "react";
import { useOutletContext } from "react-router";
import { supabase } from "../../../utils/supabase/client";

const ACCENT = "#FF7A00";
const BUCKET = "biblioteca";

interface Archivo {
  name: string;
  url: string;
  size: number;
  type: string;
  created_at: string;
  path: string;
}

export default function AdminBiblioteca({ onSelect, modal = false }: { onSelect?: (url: string) => void; modal?: boolean }) {
  const ctx = useOutletContext<any>() || {};
  const { user } = ctx;
  const [archivos, setArchivos] = useState<Archivo[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [uploading,setUploading]= useState(false);
  const [toast,    setToast]    = useState<{text:string;ok:boolean}|null>(null);
  const [search,   setSearch]   = useState("");
  const [filter,   setFilter]   = useState<"all"|"image"|"pdf">("all");
  const [selected, setSelected] = useState<string|null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const notify = (text: string, ok = true) => {
    setToast({text, ok});
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const folder = user?.id || "public";
      const { data, error } = await supabase.storage.from(BUCKET).list(folder, { sortBy: { column: "created_at", order: "desc" } });
      if (error) throw error;
      const items: Archivo[] = (data || [])
        .filter(f => f.name !== ".emptyFolderPlaceholder")
        .map(f => {
          const path = `${folder}/${f.name}`;
          const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path);
          return {
            name: f.name,
            url: publicUrl,
            size: f.metadata?.size || 0,
            type: f.metadata?.mimetype || "",
            created_at: f.created_at || "",
            path,
          };
        });
      setArchivos(items);
    } catch(e: any) {
      notify(e.message || "Error cargando archivos", false);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const handleUpload = async (files: FileList | null) => {
    if (!files || !files.length) return;
    setUploading(true);
    const folder = user?.id || "public";
    let ok = 0;
    for (const file of Array.from(files)) {
      const ext  = file.name.split(".").pop();
      const name = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const path = `${folder}/${name}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file);
      if (!error) ok++;
    }
    notify(`${ok} archivo(s) subido(s) ✓`);
    setUploading(false);
    load();
  };

  const handleDelete = async (path: string, name: string) => {
    if (!confirm(`¿Eliminar "${name}"?`)) return;
    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) { notify(error.message, false); return; }
    notify("Eliminado");
    load();
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    notify("URL copiada ✓");
  };

  const filteredArchivos = archivos.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" ? true : filter === "image" ? a.type.startsWith("image/") : a.type === "application/pdf";
    return matchSearch && matchFilter;
  });

  const fmtSize = (b: number) => b > 1024*1024 ? `${(b/1024/1024).toFixed(1)}MB` : `${(b/1024).toFixed(0)}KB`;

  const inp: React.CSSProperties = {
    padding: "0.55rem 0.75rem", border: "1.5px solid #E5E7EB",
    borderRadius: "8px", fontSize: "0.875rem", outline: "none",
    fontFamily: "DM Sans, sans-serif", background: "#fff",
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>

      {toast && (
        <div style={{ position:"fixed", bottom:"1.5rem", right:"1.5rem", zIndex:9999,
          padding:"0.75rem 1.25rem", borderRadius:"10px", fontWeight:600, fontSize:"0.875rem",
          background: toast.ok ? "#f0fdf4" : "#fef2f2",
          color: toast.ok ? "#166534" : "#dc2626",
          border: `1px solid ${toast.ok ? "#6BB87A" : "#ef4444"}`,
          boxShadow:"0 4px 16px rgba(0,0,0,0.1)" }}>
          {toast.text}
        </div>
      )}

      {/* Toolbar */}
      <div style={{ display:"flex", gap:"0.75rem", alignItems:"center", flexWrap:"wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar archivos..." style={{ ...inp, flex:1, minWidth:180 }} />

        {/* Filtros */}
        <div style={{ display:"flex", gap:"0.25rem" }}>
          {(["all","image","pdf"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding:"0.45rem 0.75rem", borderRadius:7, border:"1.5px solid #E5E7EB",
              background: filter===f ? ACCENT : "#fff",
              color: filter===f ? "#fff" : "#6B7280",
              fontWeight:600, cursor:"pointer", fontSize:"0.8rem",
            }}>
              {f === "all" ? "Todo" : f === "image" ? "🖼 Imágenes" : "📄 PDFs"}
            </button>
          ))}
        </div>

        {/* Upload */}
        <input ref={inputRef} type="file" multiple accept="image/*,application/pdf"
          onChange={e => handleUpload(e.target.files)}
          style={{ display:"none" }} />
        <button onClick={() => inputRef.current?.click()} disabled={uploading} style={{
          padding:"0.55rem 1.25rem", background: uploading ? "#ccc" : ACCENT,
          color:"#fff", border:"none", borderRadius:10, fontWeight:700,
          cursor: uploading ? "not-allowed" : "pointer", fontSize:"0.875rem", whiteSpace:"nowrap",
        }}>
          {uploading ? "Subiendo..." : "⬆ Subir archivos"}
        </button>
        <button onClick={load} style={{ ...inp, cursor:"pointer", fontSize:"1rem", color:"#6B7280" }}>↻</button>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = ACCENT; }}
        onDragLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; }}
        onDrop={e => { e.preventDefault(); e.currentTarget.style.borderColor = "#E5E7EB"; handleUpload(e.dataTransfer.files); }}
        style={{ border:"2px dashed #E5E7EB", borderRadius:12, padding:"1rem",
          textAlign:"center", color:"#9CA3AF", fontSize:"0.85rem", cursor:"pointer",
          transition:"border-color 0.2s" }}
        onClick={() => inputRef.current?.click()}
      >
        Arrastrá archivos acá o hacé click para seleccionar
      </div>

      {/* Stats */}
      <div style={{ fontSize:"0.78rem", color:"#9CA3AF" }}>
        {filteredArchivos.length} archivo(s) · {archivos.reduce((s,a) => s+a.size, 0) > 0 ? fmtSize(archivos.reduce((s,a) => s+a.size, 0)) : "0KB"} total
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign:"center", padding:"3rem", color:"#9CA3AF" }}>Cargando...</div>
      ) : filteredArchivos.length === 0 ? (
        <div style={{ textAlign:"center", padding:"3rem" }}>
          <div style={{ fontSize:"3rem" }}>🗂</div>
          <div style={{ color:"#9CA3AF", marginTop:"0.5rem" }}>No hay archivos</div>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(150px, 1fr))", gap:"0.75rem" }}>
          {filteredArchivos.map(a => {
            const isImg = a.type.startsWith("image/");
            const isPdf = a.type === "application/pdf";
            const isSelected = selected === a.url;
            return (
              <div key={a.path}
                onClick={() => { setSelected(a.url); if (onSelect) onSelect(a.url); }}
                style={{
                  border: `2px solid ${isSelected ? ACCENT : "#E5E7EB"}`,
                  borderRadius:10, overflow:"hidden", cursor:"pointer",
                  background:"#fff", boxShadow: isSelected ? `0 0 0 3px rgba(255,122,0,0.2)` : "0 1px 3px rgba(0,0,0,0.05)",
                  transition:"all 0.15s", position:"relative",
                }}>

                {/* Preview */}
                <div style={{ height:120, background:"#F9FAFB", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
                  {isImg
                    ? <img src={a.url} alt={a.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                    : <span style={{ fontSize:"3rem" }}>{isPdf ? "📄" : "📎"}</span>
                  }
                </div>

                {/* Info */}
                <div style={{ padding:"0.5rem" }}>
                  <div style={{ fontSize:"0.72rem", fontWeight:600, color:"#374151",
                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {a.name.replace(/^\d+_[a-z0-9]+\./, "archivo.")}
                  </div>
                  <div style={{ fontSize:"0.65rem", color:"#9CA3AF" }}>{fmtSize(a.size)}</div>
                </div>

                {/* Acciones */}
                <div style={{ display:"flex", borderTop:"1px solid #F3F4F6" }}>
                  <button onClick={e => { e.stopPropagation(); copyUrl(a.url); }}
                    style={{ flex:1, padding:"0.35rem", background:"none", border:"none",
                      cursor:"pointer", fontSize:"0.7rem", color:"#6B7280" }}>
                    📋 Copiar
                  </button>
                  <button onClick={e => { e.stopPropagation(); handleDelete(a.path, a.name); }}
                    style={{ flex:1, padding:"0.35rem", background:"none", border:"none",
                      cursor:"pointer", fontSize:"0.7rem", color:"#EF4444" }}>
                    🗑 Borrar
                  </button>
                </div>

                {/* Check seleccionado */}
                {isSelected && (
                  <div style={{ position:"absolute", top:6, right:6, width:22, height:22,
                    borderRadius:"50%", background:ACCENT, display:"flex",
                    alignItems:"center", justifyContent:"center", fontSize:"0.75rem", color:"#fff" }}>
                    ✓
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Botón confirmar en modo modal */}
      {modal && selected && onSelect && (
        <div style={{ position:"sticky", bottom:0, background:"#fff", padding:"1rem",
          borderTop:"1px solid #E5E7EB", display:"flex", gap:"0.75rem" }}>
          <button onClick={() => onSelect(selected)} style={{
            flex:1, padding:"0.7rem", background:ACCENT, color:"#fff",
            border:"none", borderRadius:10, fontWeight:800, cursor:"pointer",
          }}>
            Usar esta imagen
          </button>
        </div>
      )}
    </div>
  );
}