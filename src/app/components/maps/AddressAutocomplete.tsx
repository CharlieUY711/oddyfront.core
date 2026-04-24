import { useRef, useEffect, useState } from "react";

interface Props {
  value:        string;
  onChange:     (v: string) => void;
  onSelect:     (result: { address: string; lat: number; lng: number }) => void;
  placeholder?: string;
  disabled?:    boolean;
}

declare global { interface Window { google: any } }

export default function AddressAutocomplete({ value, onChange, onSelect, placeholder, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const acRef    = useRef<any>(null);
  const [ready,   setReady]   = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const init = () => {
      if (!inputRef.current || acRef.current) return;
      acRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ["address"],
      });
      acRef.current.addListener("place_changed", () => {
        const place = acRef.current.getPlace();
        if (!place.geometry) return;
        const lat     = place.geometry.location.lat();
        const lng     = place.geometry.location.lng();
        const address = place.formatted_address || place.name || "";
        onChange(address);
        onSelect({ address, lat, lng });
      });
      setReady(true);
    };

    if (window.google?.maps?.places) { init(); return; }

    const scriptId = "gmaps-script";
    if (!document.getElementById(scriptId)) {
      const key    = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      const script = document.createElement("script");
      script.id    = scriptId;
      script.src   = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places&language=es`;
      script.async = true;
      script.onload = () => init();
      document.head.appendChild(script);
    } else {
      const interval = setInterval(() => {
        if (window.google?.maps?.places) { clearInterval(interval); init(); }
      }, 100);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div style={{ position:"relative" }}>
      <span style={{ position:"absolute", left:"12px", top:"50%", transform:"translateY(-50%)", fontSize:"1rem", pointerEvents:"none", zIndex:1 }}>📍</span>
      <input
        ref={inputRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder || "Escribí tu dirección..."}
        disabled={disabled}
        style={{
          width:"100%", padding:"0.7rem 0.75rem 0.7rem 2.5rem",
          border:`1.5px solid ${focused ? "#FF7A00" : "#E5E7EB"}`,
          borderRadius:"10px", fontSize:"0.9rem", outline:"none",
          background: disabled ? "#F9FAFB" : "#fff",
          boxShadow: focused ? "0 0 0 3px rgba(255,122,0,0.1)" : "none",
          transition:"all 0.15s", boxSizing:"border-box",
        }}
      />
      {!ready && (
        <span style={{ position:"absolute", right:"12px", top:"50%", transform:"translateY(-50%)", fontSize:"0.72rem", color:"#9CA3AF" }}>
          cargando...
        </span>
      )}
    </div>
  );
}
