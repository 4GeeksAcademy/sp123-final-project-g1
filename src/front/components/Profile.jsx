import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export const Profile = () => {
    const { user } = useAuth();

    const [songUrl, setSongUrl] = useState(user?.song_url || "");
    const [savingSong, setSavingSong] = useState(false);

    // 🔹 sincroniza si el user cambia
    useEffect(() => {
        if (user?.song_url) {
            setSongUrl(user.song_url);
        }
    }, [user]);

    const handleSaveSong = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("NO HAY TOKEN");
            return;
        }

        setSavingSong(true);

        try {
            const resp = await fetch(
                "https://super-duper-space-fishstick-6vvg6vrp5w5fp6j-3001.app.github.dev/api/profile/song",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    },
                    body: JSON.stringify({
                        song_url: songUrl,
                    }),
                }
            );

            if (!resp.ok) {
                const error = await resp.json();
                console.error("ERROR GUARDANDO CANCIÓN:", error);
                setSavingSong(false);
                return;
            }

            const data = await resp.json();
            console.log("CANCIÓN GUARDADA:", data);

            // 🔥 CLAVE: ya está en songUrl → el iframe se renderiza solo
        } catch (err) {
            console.error("ERROR FETCH:", err);
        } finally {
            setSavingSong(false);
        }
    };

  return (
    <div
      className="py-5"
      style={{
        marginTop: "90px",
        backgroundColor: user.background || "#121212",
        color: "#fff",
        minHeight: "100vh"
      }}
    >
      <h2 className="text-center mb-5">Mi Perfil</h2>

      <div className="container" style={{ maxWidth: "900px" }}>

        {/* FOTO DE PERFIL */}
        <div className="mb-5 text-center">
          <img
            src={
              user.photo_url
                ? `${import.meta.env.VITE_BACKEND_URL}${user.photo_url}`
                : "https://via.placeholder.com/150"
            }
            alt="Foto de perfil"
            className="rounded-circle mb-3"
            width="150"
            height="150"
          />

          <input
            type="file"
            className="form-control bg-dark text-light"
            onChange={(e) => setPhotoFile(e.target.files[0])}
          />

          <button className="btn btn-success mt-3" onClick={handleUploadPhoto}>
            Guardar foto
          </button>
        </div>

        {/* BACKGROUND */}
        <div className="mb-5">
          <label className="form-label fw-bold">Color de fondo</label>
          <input
            type="color"
            className="form-control form-control-color"
            value={background}
            onChange={(e) => setBackground(e.target.value)}
          />

          <button className="btn btn-success mt-3" onClick={handleSaveBackground}>
            Guardar fondo
          </button>
        </div>

        {/* CANCIÓN */}
        <div className="mb-5">
          <label className="form-label fw-bold">Canción destacada (URL)</label>
          <input
            type="text"
            className="form-control bg-dark text-light"
            value={songUrl}
            onChange={(e) => setSongUrl(e.target.value)}
          />

                <button
                    className="btn btn-primary btn-sm mt-2"
                    onClick={handleSaveSong}
                    disabled={savingSong}
                >
                    {savingSong ? "Guardando..." : "Guardar canción"}
                </button>

                {songUrl ? (
                    <iframe
                        className="mt-3"
                        width="100%"
                        height="166"
                        allow="autoplay"
                        src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(
                            songUrl
                        )}`}
                    />
                ) : (
                    <p className="mt-3 text-muted">
                        No has elegido ninguna canción.
                    </p>
                )}
            </div>
        </div>
    );
};
