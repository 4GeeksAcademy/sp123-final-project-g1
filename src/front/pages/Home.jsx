import { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { MusicMap } from "../components/MusicMap.jsx";
import EventsSidebar from "../components/EventsSidebar";
import "../styles/RegionPage.css";

export const Home = () => {
  const { dispatch } = useGlobalReducer();

  useEffect(() => {
    const loadMessage = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        if (!backendUrl) return;

        const response = await fetch(backendUrl + "/api/hello");
        const data = await response.json();

        if (response.ok) {
          dispatch({ type: "set_hello", payload: data.message });
        }
      } catch (e) {
        console.error(e);
      }
    };

    loadMessage();
  }, []);


  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start"
      }}
    >
      {/* MAPA (IZQUIERDA) */}
      <div style={{ flex: 1, padding: "40px" }}>
        <section className="region-page">
          <MusicMap />
        </section>
      </div>

      {/* SIDEBAR (DERECHA) */}
      <EventsSidebar />
    </div>
  );
};
