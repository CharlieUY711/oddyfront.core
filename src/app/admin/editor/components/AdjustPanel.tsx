import { useEditorStore } from "../engine/useEditorStore";

type SliderKey = "brightness"|"contrast"|"exposure"|"saturation"|"temperature"|"tint"|"sharpness"|"blur";

const SLIDERS: { key: SliderKey; label: string; min: number; max: number }[] = [
  { key:"brightness", label:"Brillo",      min:-100, max:100 },
  { key:"contrast",   label:"Contraste",   min:-100, max:100 },
  { key:"exposure",   label:"Exposicion",  min:-100, max:100 },
  { key:"saturation", label:"Saturacion",  min:-100, max:100 },
  { key:"temperature",label:"Temperatura", min:-100, max:100 },
  { key:"tint",       label:"Tinte",       min:-100, max:100 },
  { key:"sharpness",  label:"Nitidez",     min:0,    max:100 },
  { key:"blur",       label:"Blur",        min:0,    max:20  },
];

const GROUPS = [
  { title:"Luz",     keys:["brightness","contrast","exposure"] as SliderKey[],    color:"#FF7A00" },
  { title:"Color",   keys:["saturation","temperature","tint"]  as SliderKey[],    color:"#0F3460" },
  { title:"Detalle", keys:["sharpness","blur"]                 as SliderKey[],    color:"#1DC878" },
];

export default function AdjustPanel() {
  const store = useEditorStore();

  const handle = (key: SliderKey, val: number) => {
    store.set(key, val);
    store.saveHistory(`${key}: ${val}`);
  };

  return (
    <div>
      {GROUPS.map(g => (
        <div key={g.title} style={{ padding:"10px 12px", borderBottom:`0.5px solid ${g.color}22` }}>
          <div style={{ fontSize:"10px", fontWeight:600, color:g.color, textTransform:"uppercase", letterSpacing:".08em", marginBottom:"8px" }}>
            {g.title}
          </div>
          {SLIDERS.filter(s => g.keys.includes(s.key)).map(sl => (
            <div key={sl.key} style={{ marginBottom:"8px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:"11px", color:"#6B7280", marginBottom:"3px" }}>
                <span>{sl.label}</span>
                <span style={{ fontWeight:600, color:g.color, minWidth:"28px", textAlign:"right", fontVariantNumeric:"tabular-nums" }}>
                  {store[sl.key] as number}
                </span>
              </div>
              <input
                type="range"
                min={sl.min}
                max={sl.max}
                value={store[sl.key] as number}
                style={{ width:"100%", height:"3px", accentColor:g.color, cursor:"pointer" }}
                onChange={e => handle(sl.key, parseInt(e.target.value))}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}