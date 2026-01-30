import { useState } from "react";

const CLIENT_ID = "TU_CLIENT_ID_SOUNDCLOUD";

const SongSearch = ({ onSongSelected }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const searchSongs = () => {
    fetch(
      `https://api.soundcloud.com/tracks?q=${query}&client_id=${CLIENT_ID}`
    )
      .then(res => res.json())
      .then(data => setResults(data));
  };

  const selectSong = (url) => {
    fetch(import.meta.env.VITE_BACKEND_URL + "/api/profile/song", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify({ song_url: url })
    }).then(() => {
      onSongSelected(url); 
    });
  };

  return (
    <div>
      <input
        placeholder="Buscar canción"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <button onClick={searchSongs}>Buscar</button>

      {results.map(track => (
        <div key={track.id}>
          <p>{track.title}</p>
          <button onClick={() => selectSong(track.permalink_url)}>
            Usar esta canción
          </button>
        </div>
      ))}
    </div>
  );
};

export default SongSearch;
