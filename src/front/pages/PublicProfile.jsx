import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const PublicProfile = () => {
    const { alias } = useParams();
    const navigate = useNavigate();
    const { user: loggedUser } = useAuth();

    const [user, setUser] = useState(null);
    const [people, setPeople] = useState(null);
    const [loading, setLoading] = useState(true);

    // Saber si este perfil es mío
    const isOwner = loggedUser && loggedUser.alias === alias;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/public-profile/${alias}`
                );

                const data = await res.json();
                console.log("DATA PERFIL PUBLICO:", data);

                if (res.ok) {
                    setUser(data.user);
                    setPeople(data.people);
                } else {
                    console.error("Error cargando perfil:", data);
                }
            } catch (error) {
                console.error("Error de conexión:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [alias]);

    if (loading) {
        return (
            <div className="text-center mt-5">
                <h3>Cargando perfil...</h3>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center mt-5">
                <h3>Perfil no encontrado</h3>
            </div>
        );
    }

    return (
        <div
            className="py-5"
            style={{
                marginTop: "90px",
                backgroundColor: user.background || "#121212",
                color: "#fff",
                minHeight: "100vh",
                transition: "background-color 0.3s ease"
            }}
        >
            <h2 className="text-center mb-5">{user.alias}</h2>

            {/* BOTÓN AJUSTES (solo si es mi perfil) */}
            {isOwner && (
                <div className="text-center mb-4">
                    <button
                        className="btn btn-warning fw-bold"
                        onClick={() => navigate("/profile")}
                    >
                        Ajustes
                    </button>
                </div>
            )}

            <div
                className="row justify-content-center"
                style={{ maxWidth: "1100px", margin: "0 auto" }}
            >

                {/* FOTO */}
                <div className="col-md-3 text-center">
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
                </div>

                {/* INFO */}
                <div className="col-md-5">

                    {/* ROL */}
                    <div className="mb-3">
                        <label className="form-label fw-bold">Rol</label>
                        <p className="form-control bg-dark text-light">
                            {people?.is_musician && "Músico "}
                            {people?.is_dj && "DJ "}
                            {people?.is_singer && "Cantante "}
                            {people?.is_composer && "Compositor "}
                            {people?.is_teacher && "Profesor "}
                            {people?.is_light_tech && "Técnico de luces "}
                            {people?.is_sound_tech && "Técnico de sonido "}
                            {people?.is_producer && "Productor "}
                            {people?.is_fan && "Fan "}
                        </p>
                    </div>

                    {/* BIO */}
                    <div className="mb-3">
                        <label className="form-label fw-bold">Bio</label>
                        <p
                            className="form-control bg-dark text-light"
                            style={{ minHeight: "120px", whiteSpace: "pre-line" }}
                        >
                            {people?.bio || "Este usuario aún no tiene biografía."}
                        </p>
                    </div>
                </div>

                {/* INSTRUMENTOS */}
                <div className="col-md-4">
                    <h5 className="fw-bold mb-3">Instrumentos</h5>

                    {people?.instruments?.length > 0 ? (
                        people.instruments.map((inst, i) => (
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
                        ))
                    ) : (
                        <p className="text-muted">Sin instrumentos asociados.</p>
                    )}
                </div>
            </div>
        </div>
    );
};