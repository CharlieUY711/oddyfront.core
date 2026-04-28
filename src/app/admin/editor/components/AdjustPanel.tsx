import { useEditorStore } from "../engine/useEditorStore";

const A = "#FF7A00";

type SliderKey = "brightness"|"contrast"|"exposure"|"saturation"|"temperature"|"tint"|"sharpness"|"blur";

const SLIDERS: { key: SliderKey; label: string; min: number; max: number }[] = [
  { key:"brightness", label:"Brillo",      min:-100, max:100 },
  { key:"contrast",   label:"Contraste",   min:-100, max:100 },
  { key:"exposure",   label:"Exposición",  min:-100, max:100 },
  { key:"saturation", label:"Saturación",  min:-100, max:100 },
  { key:"temperature",label:"Temperatura", min:-100, max:100 },
  { key:"tint",       label:"Tinte",       min:-100, max:100 },
  { key:"sharpness",  label:"Nitidez",     min:0,    max:100 },
  { key:"blur",       label:"Blur",        min:0,    max:20  },
];

export default function AdjustPanel() {
  const store = useEditorStore();

  const handle = (key: SliderKey, val: number) => {
    store.set(key, val);
    store.saveHistory(`${key}: ${val}`);
  };

  const inp: React.CSSProperties = {
    width:"100%", height:"3px", accentColor:'#FF7A00', cursor:"pointer"
  };

  const groups = [
    { title:"Luz",    keys:["brightness","contrast","exposure"] },
    { title:"Color",  keys:["saturation","temperature","tint"] },
    { title:"Detalle",keys:["sharpness","blur"] },
  ] as const;

  return (
    <div>
      {groups.map(g => (
        <div key={g.title} style={{ padding:"10px 12px", borderBottom:"0.5px solid var(--color-border-tertiary)" }}>
          <div style={{ fontSize:"10px", fontWeight:500, color:"var(--color-text-secondary)", textTransform:"uppercase", letterSpacing:".08em", marginBottom:"8px" }}>{g.title}</div>
          {SLIDERS.filter(s => g.keys.includes(s.key as any)).map(sl => (
            <div key={sl.key} style={{ marginBottom:"8px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:"11px", color:"var(--color-text-secondary)", marginBottom:"3px" }}>
                <span>{sl.label}</span>
                <span style={{ fontWeight:500, color:"var(--color-text-primary)", minWidth:"28px", textAlign:"right", fontVariantNumeric:"tabular-nums" }}>
                  {store[sl.key] as number}
                </span>
              </div>
              <input type="range" min={sl.min} max={sl.max} value={store[sl.key] as number}
                style={inp(sl.key)}
                onChange={e => handle(sl.key, parseInt(e.target.value))} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
