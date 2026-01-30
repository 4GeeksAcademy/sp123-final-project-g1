import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export const Profile = () => {
    const { user, people, token, setUser } = useAuth();
    const [showColorPicker, setShowColorPicker] = useState(false);

    // Temas completos
    const themes = {
        dark: {
            background: "#121212",
            text: "#FFFFFF",
            accent: "#BB86FC"
        },
        neon: {
            background: "#0A0A0A",
            text: "#39FF14",
            accent: "#FF00E6"
        },
        sunset: {
            background: "#2B0A3D",
            text: "#FFD1DC",
            accent: "#FF8C42"
        }
    };

    // Colores oscuros para fondo simple
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
            setShowColorPicker(false);
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
            setShowColorPicker(false);
        }
    };

    const activeTheme = themes[user?.theme] || themes.dark;

    return (
        <div
            className="container py-5"
            style={{
                backgroundColor: user?.background || activeTheme.background,
                color: activeTheme.text,
                minHeight: "100vh",
                transition: "background-color 0.3s ease"
            }}
        >
            <h2 className="mb-4">Perfil</h2>

            {/* FOTO */}
            <div className="mb-3">
                <h4>Foto de perfil</h4>
                <img
                    src={user?.photo_url || "https://via.placeholder.com/150"}
                    alt="Foto de perfil"
                    className="rounded-circle mb-3"
                    width="120"
                    height="120"
                />
            </div>

            <h3>{user?.alias || "Usuario"}</h3>
            <p>{people?.is_fan ? "Fan" : "Artista"}</p>
            <p>{people?.bio || "Sin biografía disponible."}</p>

            <h4>Canción destacada:</h4>
            <p>{user?.song_url || "No hay canción subida."}</p>

            <h4 className="mt-4">Instrumentos</h4>
            {people?.instruments?.length > 0 ? (
                people.instruments.map((i) => (
                    <p key={i.id}>{i.instrument.name} — Nivel {i.level}</p>
                ))
            ) : (
                <p>Sin instrumentos asociados.</p>
            )}

            <h4 className="mt-4">Géneros</h4>
            {people?.genres?.length > 0 ? (
                people.genres.map((g) => <p key={g.id}>{g.name}</p>)
            ) : (
                <p>Sin géneros asociados.</p>
            )}

            <h4 className="mt-4">Bandas</h4>
            {people?.bands?.length > 0 ? (
                people.bands.map((b) => <p key={b.id}>{b.name}</p>)
            ) : (
                <p>Sin bandas asociadas.</p>
            )}

            {/* PERSONALIZACIÓN */}
            <h4 className="mt-4">Personaliza tu perfil</h4>

            <button
                className="btn btn-outline-light mt-2"
                onClick={() => setShowColorPicker(!showColorPicker)}
            >
                Cambiar fondo de perfil
            </button>

            {showColorPicker && (
                <div className="mt-3">

                    <h5>Temas completos</h5>
                    <div className="d-flex gap-3 mb-3">
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
                    <div className="d-flex gap-2 flex-wrap">
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

            <button className="btn btn-danger mt-5">Cerrar sesión</button>
        </div>
    );
};