import { useEffect, useState } from "react";
import SongSearch from "../components/SongSearch";

const Profile = () => {
  const [songUrl, setSongUrl] = useState(null);

  useEffect(() => {
    fetch(import.meta.env.VITE_BACKEND_URL + "/api/profile/song", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.song_url) setSongUrl(data.song_url);
      });
  }, []);

  return (
    <div>
      <h2>Mi perfil</h2>

      <SongSearch onSongSelected={setSongUrl} />

      {songUrl ? (
        <iframe
          width="100%"
          height="166"
          scrolling="no"
          frameBorder="no"
          allow="autoplay"
          src={`https://w.soundcloud.com/player/?url=${songUrl}&auto_play=true`}
        />
      ) : (
        <p>Este perfil no tiene canción aún</p>
      )}
    </div>
  );
};

export default Profile;
