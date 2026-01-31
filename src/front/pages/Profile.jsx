import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export const Profile = () => {
    const { user, people, token, setUser, setPeople } = useAuth();
    const [showCustomizer, setShowCustomizer] = useState(false);
    const [bio, setBio] = useState(people?.bio || "");

    // Temas completos
    const themes = {
        dark: { background: "#121212", text: "#FFFFFF", accent: "#BB86FC" },
        neon: { background: "#0A0A0A", text: "#39FF14", accent: "#FF00E6" },
        sunset: { background: "#2B0A3D", text: "#FFD1DC", accent: "#FF8C42" }
    };

    // Colores simples
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

    // Subir foto de perfil
    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("photo", file);

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/update-photo`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData
        });

        const data = await res.json();
        if (res.ok) setUser(data.user);
    };

    // Guardar bio
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
        if (res.ok) {
            setPeople(data.people);
        }
    };

    // Cambiar color simple
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

    // Cambiar tema completo
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

    const activeTheme = themes[user?.theme] || themes.dark;

    // Rol actual
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

    return (
        <div
            className="py-5"
            style={{
                marginTop: "90px",
                backgroundColor: user?.background || activeTheme.background,
                color: activeTheme.text,
                minHeight: "100vh",
                transition: "background-color 0.3s ease"
            }}
        >
            {/* TÍTULO */}
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
                        Cambiar foto de perfil
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            style={{ display: "none" }}
                        />
                    </label>

                    {/* CAMBIAR FONDO */}
                    <button
                        className="btn btn-outline-light btn-sm mt-2"
                        onClick={() => setShowCustomizer(!showCustomizer)}
                    >
                        Cambiar fondo de perfil
                    </button>
                </div>

                {/* DATOS DEL USUARIO */}
                <div className="col-md-5">

                    {/* USERNAME */}
                    <div className="mb-3">
                        <label className="form-label fw-bold">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            value={user?.alias || user?.email || ""}
                            disabled
                        />
                    </div>

                    {/* ROLES */}
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

                    {/* BIO */}
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
                            className="btn btn-outline-light btn-sm mt-2"
                            onClick={handleSaveBio}
                        >
                            Guardar bio
                        </button>
                    </div>
                </div>

                {/* INSTRUMENTOS */}
                <div className="col-md-4">
                    <h5 className="fw-bold mb-3">Instrumentos</h5>

                    {people?.instruments?.map((inst, i) => (
                        <div key={i} className="mb-3">
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
                        </div>
                    ))}
                </div>
            </div>

            {/* PERSONALIZACIÓN */}
            {showCustomizer && (
                <div className="text-center mt-5">

                    {/* TEMAS */}
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

                    {/* COLORES */}
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
                <button className="btn btn-danger mt-5">Cerrar sesión</button>
            </div>
        </div>
    );
};