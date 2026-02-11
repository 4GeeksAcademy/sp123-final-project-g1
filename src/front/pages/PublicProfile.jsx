import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const PublicProfile = () => {
    const { alias } = useParams();
    const [user, setUser] = useState(null);
    const [people, setPeople] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/public-profile/${alias}`
                );

                const data = await res.json();

                if (res.ok) {
                    setUser(data.user);
                    setPeople(data.people);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [alias]);

    if (loading) {
        return <div className="text-center mt-5">Cargando perfil…</div>;
    }

    if (!user) {
        return <div className="text-center mt-5">Perfil no encontrado</div>;
    }

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
            <h2 className="text-center mb-5">{user.alias}</h2>

            <div className="row justify-content-center" style={{ maxWidth: "1100px", margin: "0 auto" }}>

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

                    {/* BIO */}
                    <div className="mb-3">
                        <label className="fw-bold">Bio</label>
                        <p className="form-control bg-dark text-light">
                            {people?.bio || "Este usuario aún no tiene biografía."}
                        </p>
                    </div>

                    {/* CANCIÓN DESTACADA */}
                    {user.song_url && (
                        <div className="mt-4">
                            <h5 className="fw-bold mb-2">🎧 Canción destacada</h5>

                            <iframe
                                width="100%"
                                height="166"
                                style={{ border: "none" }}
                                allow="autoplay"
                                src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(
                                    user.song_url
                                )}`}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
