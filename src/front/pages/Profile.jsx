import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import SongSearch from "../components/SongSearch";

export const Profile = () => {
    const { user, people, token, setUser, setPeople } = useAuth();
    const navigate = useNavigate();

    const [showCustomizer, setShowCustomizer] = useState(false);
    const [bio, setBio] = useState(people?.bio || "");
    const [song, setSong] = useState(null);

    /* ================= THEMES ================= */
    const themes = {
        dark: { background: "#121212", text: "#FFFFFF", accent: "#BB86FC" },
        neon: { background: "#0A0A0A", text: "#39FF14", accent: "#FF00E6" },
        sunset: { background: "#2B0A3D", text: "#FFD1DC", accent: "#FF8C42" }
    };

    /* ================= LOAD SONG ================= */
    useEffect(() => {
        const fetchSong = async () => {
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/profile/song`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await res.json();
            if (res.ok && data.song_url) {
                setSong(data);
            }
        };

        fetchSong();
    }, [token]);


    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("photo", file);

        const res = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/update-photo`,
            {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            }
        );

        const data = await res.json();
        if (res.ok) setUser(data.user);
    };

    const handleSaveBio = async () => {
        const res = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/update-bio`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ bio })
            }
        );

        const data = await res.json();
        if (res.ok) setPeople(data.people);
    };

    const activeTheme = themes[user?.theme] || themes.dark;

    

    return (
        <div
            className="py-5"
            style={{
                marginTop: "90px",
                backgroundColor: user?.background || activeTheme.background,
                color: activeTheme.text,
                minHeight: "100vh"
            }}
        >
            <h2 className="text-center mb-5">Perfil</h2>

            <div className="row justify-content-center" style={{ maxWidth: "1100px", margin: "0 auto" }}>

                {/* FOTO */}
                <div className="col-md-3 text-center">
                    <img
                        src={
                            user?.photo_url
                                ? `${import.meta.env.VITE_BACKEND_URL}${user.photo_url}?t=${Date.now()}`
                                : "https://via.placeholder.com/150"
                        }
                        alt="Foto de perfil"
                        className="rounded-circle mb-3"
                        width="150"
                        height="150"
                    />

                    <label className="btn btn-outline-light btn-sm mt-2">
                        Cambiar foto
                        <input type="file" hidden onChange={handlePhotoUpload} />
                    </label>

                    <button
                        className="btn btn-outline-light btn-sm mt-2"
                        onClick={() => setShowCustomizer(!showCustomizer)}
                    >
                        Personalizar
                    </button>
                </div>

                {/* DATOS */}
                <div className="col-md-5">
                    <label className="fw-bold">Username</label>
                    <input className="form-control mb-3" value={user?.alias || user?.email} disabled />

                    <label className="fw-bold">Bio</label>
                    <textarea
                        className="form-control"
                        rows="5"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                    <button className="btn btn-outline-light btn-sm mt-2" onClick={handleSaveBio}>
                        Guardar bio
                    </button>

                    {/* 🎵 CANCIÓN DESTACADA */}
                    <div className="mt-4">
                        <h5 className="fw-bold">🎵 Canción destacada</h5>

                        {song ? (
                            <>
                                <strong>{song.song_title}</strong>
                                <p className="text-muted">{song.song_artist}</p>

                                <iframe
                                    width="100%"
                                    height="166"
                                    allow="autoplay"
                                    src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(
                                        song.song_url
                                    )}&auto_play=false`}
                                />
                            </>
                        ) : (
                            <p className="text-muted">No has elegido ninguna canción.</p>
                        )}

                        <button
                            className="btn btn-primary btn-sm mt-3"
                            onClick={() => navigate("/music-bank")}
                        >
                            Elegir canción
                        </button>
                    </div>
                </div>

                {/* INSTRUMENTOS */}
                <div className="col-md-4">
                    <h5 className="fw-bold">Instrumentos</h5>
                    {people?.instruments?.map((inst, i) => (
                        <div key={i} className="mb-2">
                            <strong>{inst.instrument.name}</strong> — nivel {inst.level}/5
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
