import { useState, useRef, useEffect, useCallback } from "react";

interface Result { address: string; lat: number; lng: number; }
interface Props {
  value:        string;
  onChange:     (v: string) => void;
  onSelect:     (r: Result) => void;
  placeholder?: string;
  disabled?:    boolean;
}

export default function AddressAutocomplete({ value, onChange, onSelect, placeholder, disabled }: Props) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading,     setLoading]     = useState(false);
  const [focused,     setFocused]     = useState(false);
  const [showList,    setShowList]    = useState(false);
  const [userCoords,  setUserCoords]  = useState<{lat:number;lng:number} | null>(null);
  const debounceRef = useRef<any>(null);

  // Detectar ubicación del usuario al montar
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      pos => setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      ()  => setUserCoords({ lat: -34.9011, lng: -56.1645 }) // Fallback: Montevideo
    );
  }, []);

  const search = useCallback(async (q: string) => {
    if (q.length < 3) { setSuggestions([]); return; }
    setLoading(true);
    try {
      // Si tenemos coords del usuario, usamos viewbox centrado en su ubicación
      const viewbox = userCoords
        ? `&viewbox=${userCoords.lng - 0.5},${userCoords.lat + 0.5},${userCoords.lng + 0.5},${userCoords.lat - 0.5}&bounded=0`
        : `&countrycodes=uy`;

      const res  = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=6&addressdetails=1&accept-language=es${viewbox}`,
        { headers: { "Accept-Language": "es" } }
      );
      const data = await res.json();
      setSuggestions(data);
      setShowList(true);
    } catch { setSuggestions([]); }
    setLoading(false);
  }, [userCoords]);

  const handleChange = (v: string) => {
    onChange(v);
    setSuggestions([]); setShowList(false);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(v), 400);
  };

  const handleSelect = (item: any) => {
    const address = item.display_name;
    onChange(address);
    onSelect({ address, lat: parseFloat(item.lat), lng: parseFloat(item.lon) });
    setSuggestions([]); setShowList(false);
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(async pos => {
      const { latitude: lat, longitude: lng } = pos.coords;
      setUserCoords({ lat, lng });
      try {
        const res  = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=es`
        );
        const data = await res.json();
        const address = data.display_name;
        onChange(address);
        onSelect({ address, lat, lng });
      } catch {}
      setLoading(false);
    }, () => setLoading(false));
  };

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  return (
    <div style={{ position:"relative" }}>
      <span style={{ position:"absolute", left:"12px", top:"50%", transform:"translateY(-50%)",
        fontSize:"1rem", pointerEvents:"none", zIndex:1 }}>📍</span>

      <input value={value} onChange={e=>handleChange(e.target.value)} disabled={disabled}
        placeholder={placeholder || "Escribí tu dirección..."}
        onFocus={()=>{ setFocused(true); if(suggestions.length) setShowList(true); }}
        onBlur={()=>{ setFocused(false); setTimeout(()=>setShowList(false), 200); }}
        style={{ width:"100%", padding:"0.7rem 2.75rem 0.7rem 2.5rem",
          border:`1.5px solid ${focused?"#FF7A00":"#E5E7EB"}`,
          borderRadius:"10px", fontSize:"0.9rem", outline:"none",
          background: disabled?"#F9FAFB":"#fff",
          boxShadow: focused?"0 0 0 3px rgba(255,122,0,0.1)":"none",
          transition:"all 0.15s", boxSizing:"border-box" }} />

      {/* Botón geolocate */}
      <button onClick={handleGeolocate} disabled={loading}
        title="Usar mi ubicación actual"
        style={{ position:"absolute", right:"10px", top:"50%", transform:"translateY(-50%)",
          background:"transparent", border:"none", cursor:"pointer", fontSize:"1rem",
          color: loading?"#9CA3AF":"#FF7A00", padding:"4px", borderRadius:"50%",
          transition:"all 0.15s" }}>
        {loading ? "⌛" : "🎯"}
      </button>

      {/* Dropdown */}
      {showList && suggestions.length > 0 && (
        <div style={{ position:"absolute", top:"calc(100% + 4px)", left:0, right:0, zIndex:100,
          background:"#fff", border:"1.5px solid #E5E7EB", borderRadius:"10px",
          boxShadow:"0 8px 24px rgba(0,0,0,0.12)", overflow:"hidden" }}>
          {suggestions.map((item, i) => (
            <div key={item.place_id} onMouseDown={()=>handleSelect(item)}
              style={{ padding:"0.65rem 1rem", cursor:"pointer", fontSize:"0.85rem",
                borderBottom: i < suggestions.length-1 ? "1px solid #F3F4F6":"none",
                display:"flex", alignItems:"flex-start", gap:"0.5rem" }}
              onMouseEnter={e=>(e.currentTarget.style.background="#FFF8F5")}
              onMouseLeave={e=>(e.currentTarget.style.background="#fff")}>
              <span style={{ fontSize:"0.85rem", flexShrink:0, marginTop:"1px" }}>📍</span>
              <div>
                <div style={{ fontWeight:600, color:"#111", lineHeight:1.3 }}>
                  {item.address?.road
                    ? `${item.address.road}${item.address.house_number ? " " + item.address.house_number : ""}`
                    : item.display_name.split(",")[0]}
                </div>
                <div style={{ fontSize:"0.75rem", color:"#9CA3AF", marginTop:"2px" }}>
                  {[item.address?.suburb, item.address?.city || item.address?.town, item.address?.country]
                    .filter(Boolean).join(", ")}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
