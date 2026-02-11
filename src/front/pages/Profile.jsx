import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import SongSearch from "../components/SongSearch";

export const Profile = () => {
    const navigate = useNavigate();
    const { user, people, token, setUser, setPeople, logout } = useAuth();

    const [showCustomizer, setShowCustomizer] = useState(false);
    const [bio, setBio] = useState(people?.bio || "");
    const [song, setSong] = useState(null);

    const themes = {
        dark: { background: "#121212", text: "#FFFFFF", accent: "#BB86FC" },
        neon: { background: "#0A0A0A", text: "#39FF14", accent: "#FF00E6" },
        sunset: { background: "#2B0A3D", text: "#FFD1DC", accent: "#FF8C42" }
    };

    const colors = [
        { name: "Verde oscuro", value: "#0F3D0F" },
        { name: "Azul profundo", value: "#0A1A3D" },
        { name: "Rojo vino", value: "#3D0A0A" },
        { name: "Amarillo dorado oscuro", value: "#3D3200" },
        { name: "Violeta oscuro", value: "#2A0F3D" },
        { name: "Naranja quemado", value: "#3D1F0A" },
        { name: "Rosa oscuro", value: "#3D0A2A" },
        { name: "Carbón", value: "#1A1A1A" }
    ];

    const [background, setBackground] = useState(user?.background || "#121212");
    const [songUrl, setSongUrl] = useState(user?.song_url || "");
    const [photoFile, setPhotoFile] = useState(null);

    const currentRole =
        people?.is_musician ? "musician" :
        people?.is_dj ? "dj" :
        people?.is_singer ? "singer" :
        people?.is_composer ? "composer" :
        people?.is_teacher ? "teacher" :
        people?.is_light_tech ? "light_tech" :
        people?.is_sound_tech ? "sound_tech" :
        people?.is_producer ? "producer" :
        "fan";

    const [allInstruments, setAllInstruments] = useState([]);
    const [myInstruments, setMyInstruments] = useState(people?.instruments || []);
    const [selectedInstrument, setSelectedInstrument] = useState("");
    const [level, setLevel] = useState(3);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/instruments`)
            .then(res => res.json())
            .then(data => {
                const list = data.results || data;
                setAllInstruments(list);
            });
    }, []);

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
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/update-bio`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ bio })
        });

        const data = await res.json();
        if (res.ok) setPeople(data.people);
    };

    const handleColorChange = async (color) => {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/update-background`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ color })
        });

        const data = await res.json();
        if (res.ok) {
            setUser(data.user);
            setShowCustomizer(false);
        }
    };

    const handleThemeChange = async (theme) => {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/update-theme`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ theme })
        });

        const data = await res.json();
        if (res.ok) {
            setUser(data.user);
            setShowCustomizer(false);
        }
    };

    const handleSaveInstruments = async () => {
        const payload = {
            instruments: myInstruments.map(inst => ({
                instrument_id: inst.instrument_id,
                level: inst.level
            }))
        };

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/update-instruments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (res.ok) setPeople(data.people);
    };

    const removeInstrument = (id) => {
        setMyInstruments(myInstruments.filter(inst => inst.instrument_id !== id));
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

            {/* BOTÓN PARA VOLVER AL PERFIL PÚBLICO */}
            <div className="text-center mb-4">
                <button
                    className="btn btn-warning fw-bold"
                    onClick={() => navigate(`/public-profile/${user.alias}`)}
                >
                    Ver perfil público
                </button>
            </div>

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

                    <div className="mb-3">
                        <label className="form-label fw-bold">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            value={user?.alias || user?.email || ""}
                            disabled
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold">Rol</label>
                        <select className="form-select" value={currentRole} disabled>
                            <option value="musician">Músico</option>
                            <option value="dj">DJ</option>
                            <option value="singer">Cantante</option>
                            <option value="composer">Compositor</option>
                            <option value="teacher">Profesor</option>
                            <option value="light_tech">Técnico de luces</option>
                            <option value="sound_tech">Técnico de sonido</option>
                            <option value="producer">Productor</option>
                            <option value="fan">Fan</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold">Bio</label>
                        <textarea
                            className="form-control"
                            rows="6"
                            maxLength="400"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        ></textarea>
                        <small className="text-muted">Máximo 400 palabras</small>
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
                    <h5 className="fw-bold mb-3">Instrumentos</h5>

                    <select
                        className="form-select mb-3"
                        value={selectedInstrument}
                        onChange={(e) => setSelectedInstrument(e.target.value)}
                    >
                        <option value="">Selecciona un instrumento</option>
                        {allInstruments.map((inst) => (
                            <option key={inst.id} value={inst.id}>
                                {inst.name}
                            </option>
                        ))}
                    </select>

                    <div className="d-flex gap-2 mb-3">
                        {[1, 2, 3, 4, 5].map((n) => (
                            <span
                                key={n}
                                style={{
                                    cursor: "pointer",
                                    fontSize: "1.8rem",
                                    color: n <= level ? "#ff8c00" : "#ccc"
                                }}
                                onClick={() => setLevel(n)}
                            >
                                ★
                            </span>
                        ))}
                    </div>

                    <button
                        className="btn btn-primary mb-4"
                        onClick={() => {
                            if (!selectedInstrument) return;
                            const instObj = allInstruments.find(i => i.id == selectedInstrument);
                            const newList = [
                                ...myInstruments,
                                {
                                    instrument_id: instObj.id,
                                    level: level,
                                    instrument: instObj
                                }
                            ];
                            setMyInstruments(newList);
                            setSelectedInstrument("");
                            setLevel(3);
                        }}
                    >
                        Añadir instrumento
                    </button>

                    {myInstruments.map((inst, i) => (
                        <div key={i} className="mb-3 bg-dark p-3 rounded">
                            <div className="d-flex justify-content-between">
                                <span className="fw-semibold">{inst.instrument.name}</span>
                                <span className="text-muted">Nivel: {inst.level}/5</span>
                            </div>

                            <div className="d-flex gap-1 mt-1">
                                {[1, 2, 3, 4, 5].map((n) => (
                                    <div
                                        key={n}
                                        style={{
                                            width: "18px",
                                            height: "18px",
                                            borderRadius: "50%",
                                            backgroundColor: n <= inst.level ? "#ff8c00" : "#ddd"
                                        }}
                                    ></div>
                                ))}
                            </div>

                            <button
                                className="btn btn-danger btn-sm mt-2"
                                onClick={() => removeInstrument(inst.instrument_id)}
                            >
                                Eliminar
                            </button>
                        </div>
                    ))}

                    <button className="btn btn-success mt-3" onClick={handleSaveInstruments}>
                        Guardar instrumentos
                    </button>
                </div>
            </div>

            {showCustomizer && (
                <div className="text-center mt-5">
                    <h5>Temas completos</h5>
                    <div className="d-flex gap-3 mb-3 justify-content-center">
                        {Object.keys(themes).map((t) => (
                            <button
                                key={t}
                                onClick={() => handleThemeChange(t)}
                                className="btn btn-sm"
                                style={{
                                    backgroundColor: themes[t].accent,
                                    color: themes[t].text,
                                    border: "none"
                                }}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    <h5>Colores simples</h5>
                    <div className="d-flex gap-2 flex-wrap justify-content-center">
                        {colors.map((c) => (
                            <button
                                key={c.value}
                                onClick={() => handleColorChange(c.value)}
                                title={c.name}
                                style={{
                                    width: "35px",
                                    height: "35px",
                                    borderRadius: "50%",
                                    border: "2px solid white",
                                    backgroundColor: c.value,
                                    cursor: "pointer"
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}

            <div className="text-center">
                <button
                    className="btn btn-danger mt-5"
                    onClick={() => {
                        logout();
                        navigate("/");
                    }}
                >
                    Cerrar sesión
                </button>
            </div>
        </div>
    );
};
