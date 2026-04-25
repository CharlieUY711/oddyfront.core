import { useEffect, useRef } from "react";

interface Props { lat: number; lng: number; zoom?: number; height?: string; }

export default function AddressMap({ lat, lng, zoom=15, height="160px" }: Props) {
  const mapRef      = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerRef   = useRef<any>(null);
  const initRef     = useRef(false);

  useEffect(() => {
    if (initRef.current || !mapRef.current || !lat || !lng) return;
    initRef.current = true;

    import("leaflet").then(L => {
      // Fix Leaflet icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      mapInstance.current = L.map(mapRef.current!, { zoomControl:false, attributionControl:false }).setView([lat, lng], zoom);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap"
      }).addTo(mapInstance.current);

      const icon = L.divIcon({
        html:`<div style="width:20px;height:20px;background:#FF7A00;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(255,122,0,0.5)"></div>`,
        className:"", iconSize:[20,20], iconAnchor:[10,10],
      });

      markerRef.current = L.marker([lat, lng], { icon }).addTo(mapInstance.current);
    });

    return () => { mapInstance.current?.remove(); initRef.current = false; };
  }, []);

  useEffect(() => {
    if (!mapInstance.current || !lat || !lng) return;
    mapInstance.current.setView([lat, lng], zoom);
    markerRef.current?.setLatLng([lat, lng]);
  }, [lat, lng]);

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={mapRef} style={{ width:"100%", height, borderRadius:"8px", overflow:"hidden", background:"#f0f0f0" }} />
    </>
  );
}
