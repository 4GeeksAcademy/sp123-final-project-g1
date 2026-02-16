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

  const isOwner = loggedUser && loggedUser.alias === alias;

  /* ================= THEMES ================= */
  const themes = {
    sonora: {
      background: "linear-gradient(135deg, #0d0d0d, #1a1a1a)",
      accent: "#BB86FC",
      border: "rgba(187,134,252,0.35)",
    },
    neon: {
      background: "linear-gradient(135deg, #000000, #0a0a0a)",
      accent: "#39FF14",
      border: "rgba(57,255,20,0.35)",
    },
    sunset: {
      background: "linear-gradient(135deg, #2B0A3D, #FF8C42)",
      accent: "#FF8C42",
      border: "rgba(255,140,66,0.35)",
    },
    ocean: {
      background: "linear-gradient(135deg, #003973, #E5E5BE)",
      accent: "#00B4D8",
      border: "rgba(0,180,216,0.35)",
    },
    pastel: {
      background: "linear-gradient(135deg, #fbc2eb, #a6c1ee)",
      accent: "#ffb3c6",
      border: "rgba(255,179,198,0.35)",
    },
  };

  /* ================= YOUTUBE PARSER ================= */
  const getYouTubeId = (url) => {
    const regex =
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  /* ================= CARGAR PERFIL ================= */
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

  const activeTheme = themes[user.theme] || themes.sonora;

  const glass = {
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(8px)",
    border: `1px solid ${activeTheme.border}`,
    borderRadius: "16px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
    padding: "20px",
    color: "#fff",
  };

  /* ================= ROLES ================= */
  const getRoles = () => {
    if (!people) return [];
    const roles = [];
    if (people.is_musician) roles.push("Músico");
    if (people.is_dj) roles.push("DJ");
    if (people.is_singer) roles.push("Cantante");
    if (people.is_composer) roles.push("Compositor");
    if (people.is_teacher) roles.push("Profesor");
    if (people.is_light_tech) roles.push("Técnico de luces");
    if (people.is_sound_tech) roles.push("Técnico de sonido");
    if (people.is_producer) roles.push("Productor");
    if (roles.length === 0) roles.push("Fan");
    return roles;
  };

  /* ================= MULTIMEDIA ================= */
  const photos = people?.multimedia?.filter((m) => m.type === "image") || [];
  const videos = people?.multimedia?.filter((m) => m.type === "video") || [];
  const audios = people?.multimedia?.filter((m) => m.type === "audio") || [];

  /* ================= CARRUSEL ================= */
  const Carousel = ({ items, renderItem }) => {
    const [index, setIndex] = useState(0);
    const prev = () => {
      setIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
    };
    const next = () => {
      setIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    };
    if (!items.length) return null;
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "700px",
          margin: "0 auto",
          overflow: "hidden",
          borderRadius: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            transition: "transform 0.4s ease",
            transform: `translateX(-${index * 100}%)`,
          }}
        >
          {items.map((item) => (
            <div key={item.id} style={{ minWidth: "100%" }}>
              {renderItem(item)}
            </div>
          ))}
        </div>

        <button
          onClick={prev}
          style={{
            position: "absolute",
            top: "50%",
            left: "10px",
            transform: "translateY(-50%)",
            background: "rgba(0,0,0,0.5)",
            border: "none",
            color: "#fff",
            padding: "10px",
            borderRadius: "50%",
            cursor: "pointer",
          }}
        >
          ‹
        </button>

        <button
          onClick={next}
          style={{
            position: "absolute",
            top: "50%",
            right: "10px",
            transform: "translateY(-50%)",
            background: "rgba(0,0,0,0.5)",
            border: "none",
            color: "#fff",
            padding: "10px",
            borderRadius: "50%",
            cursor: "pointer",
          }}
        >
          ›
        </button>
      </div>
    );
  };

  return (
    <div
      className="py-5"
      style={{
        marginTop: "90px",
        minHeight: "100vh",
        background: activeTheme.background,
        color: "#fff",
        transition: "0.3s ease",
      }}
    >
      <h2 className="text-center mb-4">@{user.alias}</h2>

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

      <div className="container" style={{ maxWidth: "1200px" }}>
        <div className="row g-4">
          {/* FOTO + ROLES */}
          <div className="col-md-3">
            <div style={glass} className="text-center">
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

              <h5 className="mt-2">{people?.name}</h5>

              {/* COUNTRY + CITY */}
              <p className="mt-2 text-muted">
                {user.country ? `📍 ${user.country}` : ""}
                {user.city ? ` — ${user.city}` : ""}
              </p>

              <div className="d-flex flex-wrap justify-content-center gap-2 mt-2">
                {getRoles().map((role, i) => (
                  <span
                    key={i}
                    style={{
                      backgroundColor: "rgba(255,255,255,0.15)",
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "0.85rem",
                      border: `1px solid ${activeTheme.border}`,
                    }}
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* BIO */}
          <div className="col-md-5">
            <div style={glass}>
              <h4 className="fw-bold">Bio</h4>
              <p style={{ whiteSpace: "pre-line" }}>
                {people?.bio || "Este usuario aún no tiene biografía."}
              </p>
            </div>
          </div>


          {/* CANCIÓN + YOUTUBE */}
          <div className="col-md-4">
            <div style={glass}>
              <h4 className="fw-bold">Canción destacada</h4>
              {user.song_url ? (<iframe
                                width="100%"
                                height="120"
                                className="mt-3"
                                style={{ border: "none", borderRadius: "12px" }}
                                allow="autoplay"
                                src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(user.song_url)}`}/>) : (<p className="text-muted">Este usuario no ha elegido una canción.</p>)}


              {/* YOUTUBE */}
              {user.youtube_url && getYouTubeId(user.youtube_url) && (
                <>
                  <h4 className="fw-bold mt-4">Vídeo destacado</h4>
                  <iframe
                    width="100%"
                    height="250"
                    className="mt-3"
                    style={{border: "none", borderRadius: "12px", backgroundColor: "#000",}}
                    sandbox="allow-same-origin allow-scripts allow-popups allow-presentation"
                    src={`https://www.youtube.com/embed/${getYouTubeId(user.youtube_url)}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen/>
                </>
              )}
            </div>
          </div>
        </div>

        {/* INSTRUMENTOS */}
        <div className="col-md-5">
          <div style={glass}>
            <h4 className="fw-bold mb-3">Instrumentos</h4>
            {people?.instruments?.length === 0 && (<p className="text-muted">Este usuario no ha añadido instrumentos.</p>)}
            {/* CONTENEDOR AJUSTADO AL CONTENIDO */}
            <div className="d-flex flex-column gap-1" style={{ width: "fit-content" }}>
              {people?.instruments?.map((inst, i) => (
                <div key={i} className="mb-2">
                  <div
                    className="p-3 rounded"
                    style={{background: "rgba(0,0,0,0.25)", border: `1px solid ${activeTheme.border}`, width: "fit-content"}}>
                    <h6 className="fw-semibold mb-1">{inst.name}</h6>
                    {/* NIVEL */}
                    <div className="d-flex gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <div
                          key={n}
                          style={{width: "18px",height: "18px",borderRadius: "50%",backgroundColor:
                              n <= inst.level ? activeTheme.accent : "#ddd",
                          }}
                        />
                      ))}
                    </div>

                    {/* COMENTARIO DEL INSTRUMENTO */}
                    {inst.comment && (
                      <p
                        className="text-muted mt-1 mb-0"
                        style={{ fontSize: "0.9rem", maxWidth: "250px" }}
                      >
                        {inst.comment}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MULTIMEDIA */}
        <div className="mt-5">
          <h3 className="fw-bold mb-4">Multimedia</h3>

          {photos.length > 0 && (
            <div className="mb-5">
              <h4 className="fw-semibold mb-3">Fotos</h4>
              <Carousel
                items={photos}
                renderItem={(item) => (
                  <img
                    src={item.url}
                    alt="foto"
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "12px",
                      objectFit: "cover",
                    }}
                  />
                )}
              />
            </div>
          )}

          {videos.length > 0 && (
            <div className="mb-5">
              <h4 className="fw-semibold mb-3">Vídeos</h4>
              <Carousel
                items={videos}
                renderItem={(item) => (
                  <video
                    src={item.url}
                    controls
                    style={{
                      width: "100%",
                      borderRadius: "12px",
                    }}
                  />
                )}
              />
            </div>
          )}

          {audios.length > 0 && (
            <div className="mb-5">
              <h4 className="fw-semibold mb-3">Audio / MP3</h4>
              <div
                style={{
                  display: "flex",
                  overflowX: "auto",
                  gap: "20px",
                  paddingBottom: "10px",
                }}
              >
                {audios.map((item) => (
                  <audio
                    key={item.id}
                    src={item.url}
                    controls
                    style={{
                      minWidth: "250px",
                      borderRadius: "8px",
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};