import { useEffect, useState } from "react";
import "../styles/EventsSidebar.css";

const API_KEY = import.meta.env.VITE_TICKETMASTER_API_KEY;

export default function EventsSidebar() {
  const [events, setEvents] = useState([]);
  const [start, setStart] = useState(0);
  const VISIBLE = 3;

  useEffect(() => {
    fetch(
      `https://app.ticketmaster.com/discovery/v2/events.json?size=100&classificationName=music&apikey=${API_KEY}`
    )
      .then(res => res.json())
      .then(data => {
        if (!data._embedded?.events) return;

        const usedCountries = new Set();
        const usedArtists = new Set();
        const clean = [];

        for (const ev of data._embedded.events) {
          const venue = ev._embedded?.venues?.[0];
          const artist = ev._embedded?.attractions?.[0];

          if (!venue || !artist) continue;

          const country = venue.country?.name;
          const artistName = artist.name;

          if (!country || usedCountries.has(country)) continue;
          if (usedArtists.has(artistName)) continue;

          usedCountries.add(country);
          usedArtists.add(artistName);

          clean.push({
            id: ev.id,
            name: ev.name,
            artist: artistName,
            country,
            date: ev.dates.start.localDate,
            image: ev.images?.[0]?.url,
            url: ev.url
          });

          if (clean.length === 12) break;
        }

        setEvents(clean);
      })
      .catch(console.error);
  }, []);

  const visibleEvents = events.slice(start, start + VISIBLE);

  const next = () => {
    if (start + VISIBLE < events.length) {
      setStart(start + 1);
    }
  };

  const prev = () => {
    if (start > 0) {
      setStart(start - 1);
    }
  };

  if (events.length === 0) return null;

  

  return (
    <aside className="events-sidebar">
      <h3>LIVE EVENTS</h3>

      <div className="events-stack">
        {visibleEvents.map(event => (
          <div
            key={event.id}
            className="event-card"
            onClick={() => window.open(event.url, "_blank")}
          >
            <img src={event.image} alt={event.name} />
            <div className="event-info">
              <span className="artist">{event.artist}</span>
              <span className="country">{event.country}</span>
              <span className="date">{event.date}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="controls">
        <button onClick={prev} disabled={start === 0}>‹</button>
        <button onClick={next} disabled={start + VISIBLE >= events.length}>›</button>
      </div>
    </aside>
  );
}
