import { useEffect, useRef } from "react";
declare global { interface Window { google: any } }

interface Props { lat: number; lng: number; zoom?: number; height?: string; }

export default function AddressMap({ lat, lng, zoom=15, height="160px" }: Props) {
  const mapRef    = useRef<HTMLDivElement>(null);
  const mapObj    = useRef<any>(null);
  const markerObj = useRef<any>(null);

  useEffect(() => {
    const init = () => {
      if (!mapRef.current) return;
      mapObj.current = new window.google.maps.Map(mapRef.current, {
        center: { lat, lng }, zoom, disableDefaultUI: true,
        styles: [
          { elementType:"geometry", stylers:[{ color:"#f5f5f5" }] },
          { featureType:"road", elementType:"geometry", stylers:[{ color:"#ffffff" }] },
          { featureType:"water", elementType:"geometry", stylers:[{ color:"#c9c9c9" }] },
          { featureType:"poi", stylers:[{ visibility:"off" }] },
        ],
      });
      markerObj.current = new window.google.maps.Marker({
        position: { lat, lng }, map: mapObj.current,
        icon: { path: window.google.maps.SymbolPath.CIRCLE, scale:10,
          fillColor:"#FF7A00", fillOpacity:1, strokeColor:"#fff", strokeWeight:2 },
      });
    };
    if (window.google?.maps) init();
    else { const t = setInterval(() => { if(window.google?.maps){clearInterval(t);init();} }, 200); return ()=>clearInterval(t); }
  }, []);

  useEffect(() => {
    if (!mapObj.current || !markerObj.current) return;
    const pos = { lat, lng };
    mapObj.current.panTo(pos);
    markerObj.current.setPosition(pos);
  }, [lat, lng]);

  return <div ref={mapRef} style={{ width:"100%", height, borderRadius:"8px", background:"#f0f0f0" }} />;
}
