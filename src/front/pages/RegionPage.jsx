import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/RegionPage.css";

const countryMap = {
  // Europa
  ESP: "ES",
  ITA: "IT",
  FRA: "FR",
  DEU: "DE",
  PRT: "PT",
  GBR: "GB",
  IRL: "IE",
  NLD: "NL",
  BEL: "BE",
  CHE: "CH",
  AUT: "AT",
  SWE: "SE",
  NOR: "NO",
  DNK: "DK",
  FIN: "FI",
  POL: "PL",
  CZE: "CZ",
  SVK: "SK",
  HUN: "HU",
  ROU: "RO",
  BGR: "BG",
  GRC: "GR",
  HRV: "HR",
  SVN: "SI",
  SRB: "RS",
  BIH: "BA",
  MNE: "ME",
  MKD: "MK",
  ALB: "AL",
  EST: "EE",
  LVA: "LV",
  LTU: "LT",
  LUX: "LU",
  ISL: "IS",
  CYP: "CY",
  MLT: "MT",
  UKR: "UA",

  // América
  USA: "US",
  CAN: "CA",
  MEX: "MX",
  BRA: "BR",
  ARG: "AR",
  CHL: "CL",
  COL: "CO",
  PER: "PE",
  BOL: "BO",
  ECU: "EC",
  VEN: "VE",
  URY: "UY",
  PRY: "PY",
  PAN: "PA",
  CRI: "CR",
  GTM: "GT",
  SLV: "SV",
  HND: "HN",
  NIC: "NI",
  CUB: "CU",
  DOM: "DO",
  HTI: "HT",
  JAM: "JM",

  // Asia
  JPN: "JP",
  CHN: "CN",
  KOR: "KR",
  IND: "IN",
  IDN: "ID",
  THA: "TH",
  VNM: "VN",
  PHL: "PH",
  MYS: "MY",
  SGP: "SG",
  PAK: "PK",
  BGD: "BD",
  LKA: "LK",
  NPL: "NP",
  KAZ: "KZ",
  UZB: "UZ",
  ISR: "IL",
  SAU: "SA",
  ARE: "AE",
  QAT: "QA",
  KWT: "KW",
  OMN: "OM",

  // África
  ZAF: "ZA",
  MAR: "MA",
  DZA: "DZ",
  TUN: "TN",
  EGY: "EG",
  NGA: "NG",
  GHA: "GH",
  KEN: "KE",
  ETH: "ET",
  TZA: "TZ",
  UGA: "UG",
  SEN: "SN",
  CIV: "CI",
  CMR: "CM",

  // Oceanía
  AUS: "AU",
  NZL: "NZ",
  FJI: "FJ",
  PNG: "PG"
};

export const RegionPage = () => {
  const { country, city } = useParams();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  console.log("BACKEND:", backendUrl);

  // ✅ CORRECCIÓN CLAVE
  const countryCode = countryMap[country?.toUpperCase()];
  console.log("PAÍS ENVIADO:", countryCode);

  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    if (!backendUrl || !countryCode) {
      console.error("❌ BACKEND URL O COUNTRY CODE NO DEFINIDO");
      return;
    }

    setLoadingEvents(true);

    fetch(`${backendUrl}/api/events/${countryCode}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error en la respuesta del backend");
        }
        return res.json();
      })
      .then((data) => {
        console.log("EVENTOS RECIBIDOS:", data);
        setEvents(data);
        setLoadingEvents(false);
      })
      .catch((err) => {
        console.error("Error cargando eventos:", err);
        setLoadingEvents(false);
      });
  }, [countryCode, backendUrl]);

  return (
    <div className="region-page">
      <h1 className="mt-3 region-title">{country}</h1>

      <p className="region-subtitle">
        Explorando talento musical{" "}
        {city !== "all" ? `en ${city}` : "por país"}
      </p>

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

        {/* ✅ ENVÍAS ISO-2 */}
        <Link
          to={`/region/${countryCode}/events`}
          className="region-card text-decoration-none text-dark"
        >
          <h3>📅 Eventos</h3>
          <p>Ver conciertos y festivales en este país</p>
        </Link>
      </div>

      <ul className="mt-3 list-unstyled">
        <li className="row region-card align-items-center">
          <div className="col-12 col-md-3 fw-bold border-end text-center">
            username
          </div>

          <div className="col-12 col-md-2 mx-1 border-end text-center">
            country
          </div>

          <div className="col-12 col-md-2 border-end text-center">
            role
          </div>

          <div className="col-12 col-md-2 border-end text-center">
            instrument
          </div>

          <div className="col-12 col-md-2 text-end">
            <Link to="/">View profile</Link>
          </div>
        </li>
      </ul>
    </div>
  );
};
