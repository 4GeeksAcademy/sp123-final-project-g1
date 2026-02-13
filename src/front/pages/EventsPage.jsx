import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

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

export const EventsPage = () => {
  const { country } = useParams();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const countryCode = countryMap[country?.toLowerCase()] || country?.toUpperCase();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!backendUrl || !countryCode) return;

    fetch(`${backendUrl}/api/events/${countryCode}`)
      .then(res => {
        if (!res.ok) throw new Error("Error backend");
        return res.json();
      })
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [countryCode, backendUrl]);

  if (loading) return <p>Cargando eventos...</p>;

  return (
    <div className="container mt-4">
      <h2>Eventos en {countryCode}</h2>

      {events.length === 0 && <p>No hay eventos disponibles</p>}

      {events.map(event => (
        <div key={event.id} className="mb-4">
          <h5>{event.name}</h5>
          <small>{event.date}</small>
          {event.image && (
            <img src={event.image} style={{ width: "100%" }} />
          )}
        </div>
      ))}
    </div>
  );
};
