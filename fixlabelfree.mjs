import { readFileSync, writeFileSync } from "fs";
const file = "src/app/admin/pages/AdminProfile.tsx";
let c = readFileSync(file, "utf8");

// Reemplazar los botones de etiqueta por botones Casa/Trabajo + campo texto libre para Otro
c = c.replace(
  `          {/* Etiqueta */}
          <div>
            <label style={{ fontSize:"0.72rem", fontWeight:600, color:"#6B7280", display:"block", marginBottom:"4px" }}>Etiqueta</label>
            <div style={{ display:"flex", gap:"0.5rem" }}>
              {["Casa","Trabajo","Otro"].map(l => (
                <button key={l} onClick={()=>setForm((p:any)=>({...p,label:l}))}
                  style={{ flex:1, padding:"0.45rem", border:\`1.5px solid \${form.label===l?"#FF7A00":"#E5E7EB"}\`,
                    background: form.label===l?"rgba(255,122,0,0.08)":"#fff",
                    color: form.label===l?"#FF7A00":"#6B7280",
                    borderRadius:"8px", cursor:"pointer", fontWeight:form.label===l?700:400, fontSize:"0.82rem" }}>
                  {l==="Casa"?"🏠":l==="Trabajo"?"💼":"📌"} {l}
                </button>
              ))}
            </div>
          </div>`,

  `          {/* Etiqueta */}
          <div>
            <label style={{ fontSize:"0.72rem", fontWeight:600, color:"#6B7280", display:"block", marginBottom:"4px" }}>Etiqueta</label>
            <div style={{ display:"flex", gap:"0.5rem" }}>
              {["Casa","Trabajo"].map(l => (
                <button key={l} onClick={()=>setForm((p:any)=>({...p,label:l}))}
                  style={{ padding:"0.45rem 1rem", border:\`1.5px solid \${form.label===l?"#FF7A00":"#E5E7EB"}\`,
                    background: form.label===l?"rgba(255,122,0,0.08)":"#fff",
                    color: form.label===l?"#FF7A00":"#6B7280",
                    borderRadius:"8px", cursor:"pointer", fontWeight:form.label===l?700:400, fontSize:"0.82rem" }}>
                  {l==="Casa"?"🏠":"💼"} {l}
                </button>
              ))}
              <input
                value={!["Casa","Trabajo"].includes(form.label) ? form.label : ""}
                onChange={e => setForm((p:any) => ({...p, label: e.target.value || "Otro"}))}
                onFocus={e => { setForm((p:any) => ({...p, label: e.target.value || ""})); e.target.style.borderColor="#FF7A00"; }}
                onBlur={e => { if(!e.target.value) setForm((p:any)=>({...p,label:"Otro"})); e.target.style.borderColor="#E5E7EB"; }}
                placeholder="📌 Otro (ej: Casa de playa)"
                style={{ flex:1, padding:"0.45rem 0.75rem",
                  border:\`1.5px solid \${!["Casa","Trabajo"].includes(form.label)?"#FF7A00":"#E5E7EB"}\`,
                  background: !["Casa","Trabajo"].includes(form.label)?"rgba(255,122,0,0.08)":"#fff",
                  borderRadius:"8px", fontSize:"0.82rem", outline:"none",
                  color: !["Casa","Trabajo"].includes(form.label)?"#FF7A00":"#6B7280" }} />
            </div>
          </div>`
);

writeFileSync(file, c, "utf8");
console.log(c.includes("Casa de playa") ? "OK" : "WARN - not replaced");
