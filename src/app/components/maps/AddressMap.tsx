import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface Props { lat: number; lng: number; zoom?: number; height?: string; }

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function AddressMap({ lat, lng, zoom=15, height="180px" }: Props) {
  const mapRef     = useRef<HTMLDivElement>(null);
  const mapObj     = useRef<mapboxgl.Map | null>(null);
  const markerObj  = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current || !lat || !lng) return;

    mapObj.current = new mapboxgl.Map({
      container: mapRef.current,
      style:     "mapbox://styles/mapbox/streets-v12",
      center:    [lng, lat],
      zoom,
      interactive: false,
    });

    // Marker naranja custom
    const el = document.createElement("div");
    el.style.cssText = "width:20px;height:20px;background:#FF7A00;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(255,122,0,0.5)";

    markerObj.current = new mapboxgl.Marker({ element: el })
      .setLngLat([lng, lat])
      .addTo(mapObj.current);

    return () => { mapObj.current?.remove(); };
  }, []);

  useEffect(() => {
    if (!mapObj.current || !lat || !lng) return;
    mapObj.current.flyTo({ center: [lng, lat], zoom, speed: 1.5 });
    markerObj.current?.setLngLat([lng, lat]);
  }, [lat, lng]);

  return <div ref={mapRef} style={{ width:"100%", height, borderRadius:"10px", overflow:"hidden" }} />;
}
