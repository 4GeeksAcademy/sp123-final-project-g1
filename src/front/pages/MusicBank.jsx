import SongSearch from "../components/SongSearch";
import { useNavigate } from "react-router-dom";

export const MusicBank = () => {
  const navigate = useNavigate();

  const handleSongSelected = async (songUrl) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/profile/song`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            song_url: songUrl,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Error al guardar la canción");
      }

      
      navigate("/profile");
    } catch (error) {
      console.error(error);
      alert("No se pudo guardar la canción");
    }
  };

  return (
    <div className="container py-5" style={{ marginTop: "90px" }}>
      <SongSearch onSongSelected={handleSongSelected} />
    </div>
  );
};
