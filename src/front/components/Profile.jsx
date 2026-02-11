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
        <div style={{ marginTop: "90px", minHeight: "100vh" }}>
            <h2 className="text-center mb-5">Perfil</h2>

            <div className="col-md-5 mx-auto">
                <h5 className="fw-bold">🎵 Canción destacada</h5>

                <input
                    type="text"
                    className="form-control"
                    placeholder="Pega aquí la URL de SoundCloud"
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
