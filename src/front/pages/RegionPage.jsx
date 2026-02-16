import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/RegionPage.css";
import { useNavigate } from "react-router-dom";

export const RegionPage = () => {
  const { country } = useParams();
  const navigate = useNavigate();

  const [people, setPeople] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);

  const filterLogic = {
    musicians: (p) => p.is_musician || p.is_singer || p.is_dj,
    producers: (p) => p.is_producer || p.is_composer,
    technicians: (p) => p.is_light_tech || p.is_sound_tech || p.is_teacher,
    fans: (p) => p.is_fan,
  };

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const res = await fetch(`https://jubilant-umbrella-r4vqqj9vj59xcx676-3001.app.github.dev/api/people?country=${country}`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.results; setPeople(list);
      }
      catch { console.log("Failed to fetch people"); }
    };
    fetchPeople();
  }, [country]);


  const filteredPeople = activeFilter ? people.filter(filterLogic[activeFilter]) : people;

  return (
    <div className="region-page">
      <h1 className="mt-3 region-title">{country}</h1>
      <p className="region-subtitle">Explorando talento musical por país</p>
      {/* FILTROS */}
      <div className="region-grid">
        <div className={`region-card ${activeFilter === "musicians" ? "active" : ""}`} onClick={() => setActiveFilter("musicians")}>
          <h3>Músicos</h3>
          <p>Descubre artistas individuales de esta región</p>
        </div>
        <div className={`region-card ${activeFilter === "technicians" ? "active" : ""}`} onClick={() => setActiveFilter("technicians")}>
          <h3>Técnicos</h3>
          <p>Light & sound tech</p>
        </div>
        <div className={`region-card ${activeFilter === "producers" ? "active" : ""}`} onClick={() => setActiveFilter("producers")}>
          <h3>Productores</h3>
          <p>Productores, beatmakers y estudios locales</p>
        </div>
        <div className={`region-card ${activeFilter === "fans" ? "active" : ""}`} onClick={() => setActiveFilter("fans")}>
          <h3>Fans</h3>
          <p>Personas que siguen la música de la región</p>
        </div>
      </div>
      {/* Resultados */}
      <ul className="mt-3 list-unstyled">
        {filteredPeople.map((person) => (
          <li key={person.id} className="row region-card align-items-center">
            <div className="col-12 col-md-1 fw-bold text-center">
              {person.photo_url ? (
                <img src={person.photo_url} alt={person.username || "Profile"}
                  style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }}/>
                ) : ( "no profile picture" )}
            </div>
            <div className="col-12 col-md-2 fw-bold border-end text-center">
              {person.alias}
            </div>
            <div className="col-12 col-md-2 mx-1 border-end text-center">
              {person.country}
            </div>
            <div className="col-12 col-md-2 border-end text-center">
              {person.is_musician ? "Músico"
                : person.is_dj ? "DJ"
                  : person.is_singer ? "Cantante"
                    : person.is_composer ? "Compositor"
                      : person.is_producer ? "Productor"
                        : person.is_light_tech || person.is_sound_tech ? "Técnico"
                          : person.is_fan ? "Fan" : "—"}
            </div>
            <div className="col-12 col-md-2 border-end text-center">
              {person.instruments?.map((i) => i.name).join(", ") || "—"}
            </div>
            <div className="col-12 col-md-2 text-end" onClick={() => navigate(`/public-profile/${person.alias}`)}>
              {/* <Link to={`/public-profile/${person.alias}`}>View profile</Link> */}
              View profile
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};