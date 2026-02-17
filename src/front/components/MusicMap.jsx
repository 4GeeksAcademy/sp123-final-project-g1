import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { useNavigate } from "react-router-dom";

export const MusicMap = () => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/guerrero1599/cmkybpiam000301qw3a4herym",
      center: [0, 20],
      zoom: 2,
    });

    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("load", () => {
      addCountryLayer(map);
      addMapInteractions(map);

      // 🔑 Ajuste inicial tras load
      map.resize();
    });

    // 🔑 OBSERVA cambios reales de tamaño del contenedor
    const resizeObserver = new ResizeObserver(() => {
      if (mapRef.current) {
        mapRef.current.resize();
      }
    });

    resizeObserver.observe(mapContainer.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
    };
  }, []);

  const addCountryLayer = (map) => {
    map.addSource("countries", {
      type: "vector",
      url: "mapbox://mapbox.country-boundaries-v1",
    });

    map.addLayer({
      id: "country-fill",
      type: "fill",
      source: "countries",
      "source-layer": "country_boundaries",
      paint: {
        "fill-color": "#4cc9f0",
        "fill-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          0.4,
          0,
        ],
      },
    });
  };

  const addMapInteractions = (map) => {
    let hoveredCountryId = null;

    map.on("mousemove", "country-fill", (e) => {
      map.getCanvas().style.cursor = "pointer";

      if (hoveredCountryId !== null) {
        map.setFeatureState(
          {
            source: "countries",
            sourceLayer: "country_boundaries",
            id: hoveredCountryId,
          },
          { hover: false }
        );
      }

      hoveredCountryId = e.features[0].id;

      map.setFeatureState(
        {
          source: "countries",
          sourceLayer: "country_boundaries",
          id: hoveredCountryId,
        },
        { hover: true }
      );
    });

    map.on("mouseleave", "country-fill", () => {
      map.getCanvas().style.cursor = "";

      if (hoveredCountryId !== null) {
        map.setFeatureState(
          {
            source: "countries",
            sourceLayer: "country_boundaries",
            id: hoveredCountryId,
          },
          { hover: false }
        );
      }

      hoveredCountryId = null;
    });

    map.on("click", "country-fill", (e) => {
      const countryCode =
        e.features[0].properties.iso_3166_1_alpha_3;

      navigate(`/region/${countryCode}`);
    });
  };

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
