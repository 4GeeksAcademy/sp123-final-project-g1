import { useParams } from "react-router-dom";
import "../styles/RegionPage.css";
import { Link } from "react-router-dom";

export const RegionPage = () => {
  const { country, city } = useParams();

  return (
    <div className="region-page">
      <h1 className="mt-3 region-title">{country}</h1>
      <p className="region-subtitle">
        Explorando talento musical {city !== "all" ? `en ${city}` : "por país"}
      </p>

      {/* filtros */}

      <div className="region-grid">
        <div className="region-card">
          <h3>🎶 Músicos</h3>
          <p>Descubre artistas individuales de esta región</p>
        </div>

        <div className="region-card">
          <h3>🎸 Bandas</h3>
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

      {/* resultados */}

      <ul className="mt-3 list-unstyled">
        <li className="row region-card align-items-center">
          <div className="col-12 col-md-3 fw-bold border-end text-center">
            {/* {user.username} */}
            username
          </div>

          <div className="col-12 col-md-2 mx-1 border-end text-center">
            {/* {user.country} */}
            country
          </div>

          <div className="col-12 col-md-2 border-end text-center">
            {/* {user.instrument} */}
            role
          </div>

          <div className="col-12 col-md-2 border-end text-center">
            {/* {user.instrument} */}
            instrument
          </div>

          <div className="col-12 col-md-2 text-end">
            <Link to="/">
              View profile
            </Link>
          </div>
        </li>
      </ul>

    </div>
  );
};
