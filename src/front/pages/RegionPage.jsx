import { useParams } from "react-router-dom";
import "../styles/RegionPage.css";

export const RegionPage = () => {
  const { country, city } = useParams();

  return (
    <div className="region-page">
      <h1 className="region-title">{country}</h1>
      <p className="region-subtitle">
        Explorando talento musical {city !== "all" ? `en ${city}` : "por país"}
      </p>

      <div className="region-grid">
        <div className="region-card">
          <h3>🎸 Músicos</h3>
          <p>Descubre artistas individuales de esta región</p>
        </div>

        <div className="region-card">
          <h3>🎶 Bandas</h3>
          <p>Explora bandas activas y proyectos colaborativos</p>
        </div>

        <div className="region-card">
          <h3>🎛️ Productores</h3>
          <p>Productores, beatmakers y estudios locales</p>
        </div>

        <div className="region-card">
          <h3>📅 Eventos</h3>
          <p>Conciertos, festivales y encuentros musicales</p>
        </div>
      </div>
    </div>
  );
};
