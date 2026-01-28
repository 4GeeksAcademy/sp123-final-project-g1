import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

export const MusicMap = () => {
  const mapContainer = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

    if (!mapboxgl.accessToken) {
      console.error("❌ Mapbox token not found. Check your .env file");
      return;
    }

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/guerrero1599/cmkybpiam000301qw3a4herym",
      center: [0, 20],
      zoom: 2,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => map.remove();
  }, []);

  return (
    <div
      ref={mapContainer}
      style={{
        width: "100%",
        height: "800px",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    />
  );
};
