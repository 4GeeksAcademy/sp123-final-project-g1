import { useState } from "react";

const SongSearch = ({ onSongSelected }) => {
  const [url, setUrl] = useState("");

  const handleSave = () => {
    if (!url.includes("soundcloud.com")) {
      alert("Introduce una URL válida de SoundCloud");
      return;
    }

    onSongSelected(url);
  };

  return (
    <div>
      <h3>🎧 Canción destacada</h3>

      <input
        type="text"
        placeholder="Pega aquí la URL de SoundCloud"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: "100%", padding: "8px" }}
      />

      <button onClick={handleSave} style={{ marginTop: "10px" }}>
        Guardar canción
      </button>
    </div>
  );
};

export default SongSearch;
