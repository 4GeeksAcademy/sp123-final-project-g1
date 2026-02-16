import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/EventsPage.css";

const countryMap = {
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

  JPN: "JP",
  CHN: "CN",
  KOR: "KR",
  IND: "IN",

  ZAF: "ZA",
  MAR: "MA",
  DZA: "DZ",
  TUN: "TN",
  EGY: "EG",

  AUS: "AU",
  NZL: "NZ"
};

export const EventsPage = () => {
  const { country } = useParams();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const countryCode =
    countryMap[country?.toUpperCase()] || country?.toUpperCase();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!backendUrl || !countryCode) return;

    fetch(`${backendUrl}/api/events/${countryCode}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error backend");
        return res.json();
      })
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [countryCode, backendUrl]);

  if (loading) return <p className="text-center mt-4">Cargando eventos...</p>;

  return (
    <div className="container events-page">
      <h2 className="mb-4 text-center">Eventos en {countryCode}</h2>

      {events.length === 0 && (
        <p className="text-center">No hay eventos disponibles</p>
      )}

      <ul className="events-grid">
        {events.map((event) => (
          <li key={event.id} className="event-card">
            {event.image && (
              <div className="event-image-wrapper">
                <img
                  src={event.image}
                  alt={event.name}
                  className="event-image"
                />
              </div>
            )}

            <div className="event-info">
              <h5 className="event-title">{event.name}</h5>
              <p className="event-date">{event.date}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
