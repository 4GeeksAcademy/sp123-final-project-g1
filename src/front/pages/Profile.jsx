import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const navigate = useNavigate();
  const { user, people, token, setUser, setPeople, logout } = useAuth();

  const [bio, setBio] = useState(people?.bio || "");
  const [songUrl, setSongUrl] = useState(user?.song_url || "");
  const [youtubeUrl, setYoutubeUrl] = useState(user?.youtube_url || "");
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [savingSong, setSavingSong] = useState(false);
  const [allInstruments, setAllInstruments] = useState([]);
  const [myInstruments, setMyInstruments] = useState(people?.instruments || []);
  const [selectedInstrument, setSelectedInstrument] = useState("");
  const [level, setLevel] = useState(3);
  const [pendingFiles, setPendingFiles] = useState([]);

  /* ================= COUNTRIES (ISO‑3166‑1 alpha‑3) ================= */
  const countries = [
    { code: "AFG", name: "Afghanistan" },
    { code: "ALB", name: "Albania" },
    { code: "DZA", name: "Algeria" },
    { code: "AND", name: "Andorra" },
    { code: "ARG", name: "Argentina" },
    { code: "AUS", name: "Australia" },
    { code: "AUT", name: "Austria" },
    { code: "BEL", name: "Belgium" },
    { code: "BRA", name: "Brazil" },
    { code: "CAN", name: "Canada" },
    { code: "CHL", name: "Chile" },
    { code: "CHN", name: "China" },
    { code: "COL", name: "Colombia" },
    { code: "CZE", name: "Czech Republic" },
    { code: "DNK", name: "Denmark" },
    { code: "EGY", name: "Egypt" },
    { code: "FIN", name: "Finland" },
    { code: "FRA", name: "France" },
    { code: "DEU", name: "Germany" },
    { code: "GRC", name: "Greece" },
    { code: "HUN", name: "Hungary" },
    { code: "IND", name: "India" },
    { code: "IDN", name: "Indonesia" },
    { code: "IRL", name: "Ireland" },
    { code: "ISR", name: "Israel" },
    { code: "ITA", name: "Italy" },
    { code: "JPN", name: "Japan" },
    { code: "MEX", name: "Mexico" },
    { code: "NLD", name: "Netherlands" },
    { code: "NZL", name: "New Zealand" },
    { code: "NOR", name: "Norway" },
    { code: "PER", name: "Peru" },
    { code: "POL", name: "Poland" },
    { code: "PRT", name: "Portugal" },
    { code: "ROU", name: "Romania" },
    { code: "RUS", name: "Russia" },
    { code: "ESP", name: "Spain" },
    { code: "SWE", name: "Sweden" },
    { code: "CHE", name: "Switzerland" },
    { code: "TUR", name: "Turkey" },
    { code: "GBR", name: "United Kingdom" },
    { code: "USA", name: "United States" },
    { code: "URY", name: "Uruguay" },
    { code: "VEN", name: "Venezuela" },
  ];

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

  const activeTheme = themes[user?.theme] || themes.sonora;

  /* ================= LOAD INSTRUMENTS ================= */
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/instruments`)
      .then((res) => res.json())
      .then((data) => {
        const list = data.results || data;
        setAllInstruments(list);
      });
  }, []);

  /* ================= YOUTUBE PARSER ================= */
  const getYouTubeId = (url) => {
    const regex =
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  /* ================= PHOTO ================= */
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
        body: formData,
      }
    );

    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    }
  };

  /* ================= BIO ================= */
  const handleSaveBio = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/update-bio`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bio }),
      }
    );

    const data = await res.json();
    if (res.ok) {
      setPeople(data.people);
      localStorage.setItem("people", JSON.stringify(data.people));
      setBio(data.people.bio || "");
    }
  };

  /* ================= THEME ================= */
  const handleThemeChange = async (theme) => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/update-theme`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ theme }),
      }
    );

    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      setShowCustomizer(false);
    }
  };

  /* ================= SONG ================= */
  const handleSaveSong = async () => {
    setSavingSong(true);
    try {
      const resp = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/profile/song`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({ song_url: songUrl }),
        }
      );

      const data = await resp.json();
      if (resp.ok) {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      }
    } finally {
      setSavingSong(false);
    }
  };

  /* ================= YOUTUBE SAVE ================= */
  const handleSaveYoutube = async () => {
    const resp = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/profile/youtube`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ youtube_url: youtubeUrl }),
      }
    );

    const data = await resp.json();
    if (resp.ok) {
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    }
  };

  /* ================= UPDATE COUNTRY ================= */
  const handleSaveCountry = async (newCountry) => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/update-country`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ country: newCountry }),
      }
    );

    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    }
  };

  /* ================= UPDATE CITY ================= */
  const handleSaveCity = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/update-city`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ city: user.city }),
    });
    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    }
  };

  /* ================= MULTIMEDIA UPLOAD ================= */
  const handleUploadMultimedia = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/upload-multimedia`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );

    const data = await res.json();

    if (res.ok) {
      const updated = {
        ...people,
        multimedia: [...(people.multimedia || []), data],
      };

      setPeople(updated);
      localStorage.setItem("people", JSON.stringify(updated));
    }
  };

  /* ================= DELETE MULTIMEDIA ================= */
  const handleDeleteMedia = async (id) => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/multimedia/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.ok) {
      const updated = {
        ...people,
        multimedia: people.multimedia.filter((m) => m.id !== id),
      };

      setPeople(updated);
      localStorage.setItem("people", JSON.stringify(updated));
    }
  };

  /* ================= ROLES ================= */
  const handleSaveRoles = async () => {
    const payload = {
      is_musician: people.is_musician || false,
      is_dj: people.is_dj || false,
      is_singer: people.is_singer || false,
      is_composer: people.is_composer || false,
      is_teacher: people.is_teacher || false,
      is_light_tech: people.is_light_tech || false,
      is_sound_tech: people.is_sound_tech || false,
      is_producer: people.is_producer || false,
    };

    const allFalse = Object.values(payload).every((v) => v === false);
    if (allFalse) payload.is_fan = true;

    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/update-roles`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();
    if (res.ok) {
      setPeople(data.people);
      localStorage.setItem("people", JSON.stringify(data.people));
    }
  };

  /* ================= INSTRUMENTS ================= */
  const handleSaveInstruments = async () => {
    const payload = {
      instruments: myInstruments.map((inst) => ({
        instrument_id: inst.instrument_id,
        level: inst.level,
        comment: inst.comment || "",
      })),
    };

    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/update-instruments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();
    if (res.ok) {
      setPeople(data.people);
      localStorage.setItem("people", JSON.stringify(data.people));
    }
  };

  const removeInstrument = (id) => {
    setMyInstruments(myInstruments.filter((inst) => inst.instrument_id !== id));
  };

  /* ================= GLASS STYLE ================= */
  const glass = {
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(8px)",
    border: `1px solid ${activeTheme.border}`,
    borderRadius: "16px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
    padding: "20px",
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
      {/* BOTÓN PERFIL PÚBLICO */}
      <div className="text-center mb-4">
        <button
          className="btn btn-warning fw-bold"
          onClick={() => navigate(`/public-profile/${user.alias}`)}
        >
          Ver perfil público
        </button>
      </div>

      <h2 className="text-center mb-5">Perfil</h2>

      <div className="container" style={{ maxWidth: "1300px" }}>
        <div className="row g-4">
          {/* FOTO */}
          <div className="col-md-3">
            <div style={glass}>
              <div className="text-center">

                {/* FOTO DE PERFIL */}
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
                  style={{ objectFit: "cover" }}
                />

                {/* BOTONES DEBAJO DE LA FOTO — CAMBIO 1 */}
                <div className="d-flex flex-column align-items-center gap-2 mt-2">

                  {/* Botón cambiar foto */}
                  <label className="btn btn-outline-light btn-sm w-100 text-center">
                    Cambiar foto
                    <input type="file" hidden onChange={handlePhotoUpload} />
                  </label>

                  {/* Botón personalizar */}
                  <button
                    className="btn btn-outline-light btn-sm w-100"
                    onClick={() => setShowCustomizer(!showCustomizer)}
                  >
                    Personalizar
                  </button>

                </div>

                {/* CUSTOMIZER DE TEMAS — CAMBIO 2 */}
                {showCustomizer && (
                  <div className="mt-3 p-3 rounded" style={glass}>
                    <h6 className="text-center mb-2">Temas disponibles</h6>

                    <div className="d-flex flex-wrap gap-2 justify-content-center">
                      {Object.keys(themes).map((t) => (
                        <button
                          key={t}
                          onClick={() => handleThemeChange(t)}
                          className="btn btn-sm"
                          style={{
                            backgroundColor: themes[t].accent,
                            color: "#fff",
                            border: "none",
                            textTransform: "capitalize",
                          }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* DATOS */}
          <div className="col-md-5">
            <div style={glass}>
              <label className="fw-bold">Username</label>
              <input
                type="text"
                className="form-control mb-3"
                value={user?.alias || user?.email || ""}
                disabled
              />

              {/* COUNTRY */}
              <label className="fw-bold mt-3">País *</label>
              <select
                className="form-control bg-dark text-light mb-2"
                value={user.country || ""}
                onChange={(e) => handleSaveCountry(e.target.value)}
              >
                <option value="">Selecciona un país</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* CITY */}
              <label className="fw-bold mt-2">Ciudad (opcional)</label>
              <input
                type="text"
                className="form-control bg-dark text-light mb-2"
                value={user.city || ""}
                onChange={(e) => setUser({ ...user, city: e.target.value })}
              />

              <button
                className="btn btn-success btn-sm mb-3"
                onClick={handleSaveCity}
              >
                Guardar ciudad
              </button>

              {/* ROLES */}
              <label className="fw-bold">Roles</label>
              <div
                className="mb-3 mt-2"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "10px",
                }}
              >
                {[
                  { key: "is_musician", label: "Músico" },
                  { key: "is_dj", label: "DJ" },
                  { key: "is_singer", label: "Cantante" },
                  { key: "is_composer", label: "Compositor" },
                  { key: "is_teacher", label: "Profesor" },
                  { key: "is_light_tech", label: "Técnico de luces" },
                  { key: "is_sound_tech", label: "Técnico de sonido" },
                  { key: "is_producer", label: "Productor" },
                ].map((role) => (
                  <label
                    key={role.key}
                    className="d-flex align-items-center gap-2 p-2 rounded"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: `1px solid ${activeTheme.border}`,
                      borderRadius: "10px",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={people?.[role.key] || false}
                      onChange={(e) => {
                        const updated = {
                          ...people,
                          [role.key]: e.target.checked,
                        };
                        if (e.target.checked) updated.is_fan = false;
                        setPeople(updated);
                      }}
                    />
                    {role.label}
                  </label>
                ))}

                {/* FAN */}
                <label
                  className="d-flex align-items-center gap-2 p-2 rounded"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: `1px solid ${activeTheme.border}`,
                    borderRadius: "10px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={
                      !people?.is_musician &&
                      !people?.is_dj &&
                      !people?.is_singer &&
                      !people?.is_composer &&
                      !people?.is_teacher &&
                      !people?.is_light_tech &&
                      !people?.is_sound_tech &&
                      !people?.is_producer
                    }
                    onChange={() => {
                      setPeople({
                        ...people,
                        is_musician: false,
                        is_dj: false,
                        is_singer: false,
                        is_composer: false,
                        is_teacher: false,
                        is_light_tech: false,
                        is_sound_tech: false,
                        is_producer: false,
                      });
                    }}
                  />
                  Fan
                </label>
              </div>

              <button
                className="btn btn-success btn-sm mb-3"
                onClick={handleSaveRoles}
              >
                Guardar roles
              </button>

              <hr />

              {/* BIO */}
              <label className="fw-bold">Bio</label>
              <textarea
                className="form-control mb-2"
                rows="5"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              ></textarea>

              <button className="btn btn-success btn-sm" onClick={handleSaveBio}>
                Guardar bio
              </button>
            </div>
          </div>

          {/* CANCIÓN + YOUTUBE */}
          <div className="col-md-4">
            <div style={glass}>
              <label className="fw-bold">Canción destacada (URL)</label>
              <input
                type="text"
                className="form-control bg-dark text-light mb-2"
                value={songUrl}
                onChange={(e) => setSongUrl(e.target.value)}
              />

              <button
                className="btn btn-success btn-sm"
                onClick={handleSaveSong}
              >
                Guardar canción
              </button>

              <button
                className="btn btn-primary btn-sm ms-2"
                onClick={() => navigate("/music-bank")}
              >
                Elegir canción
              </button>

              {/* SOUNDCLOUD */}
              {user.song_url && (
                <iframe
                  width="100%"
                  height="120"
                  className="mt-3"
                  style={{ border: "none", borderRadius: "12px" }}
                  allow="autoplay"
                  src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(
                    user.song_url
                  )}`}
                />
              )}

              {/* YOUTUBE INPUT */}
              <label className="fw-bold mt-4">Vídeo de YouTube</label>
              <input
                type="text"
                className="form-control bg-dark text-light mb-2"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
              />

              <button
                className="btn btn-success btn-sm"
                onClick={handleSaveYoutube}
              >
                Guardar vídeo
              </button>

              {/* YOUTUBE PLAYER */}
              {user.youtube_url && getYouTubeId(user.youtube_url) && (
                <iframe
                  width="100%"
                  height="250"
                  className="mt-3"
                  style={{
                    border: "none",
                    borderRadius: "12px",
                    backgroundColor: "#000",
                  }}
                  sandbox="allow-same-origin allow-scripts allow-popups allow-presentation"
                  src={`https://www.youtube.com/embed/${getYouTubeId(
                    user.youtube_url
                  )}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </div>

          {/* MULTIMEDIA */}
          <div style={{ ...glass, marginTop: "20px" }}>
            <h4 className="fw-bold mb-3">Multimedia</h4>

            <p className="text-muted" style={{ fontSize: "0.9rem" }}>
              Sube fotos, vídeos o música (mp3). Tamaño máximo recomendado: 20MB.
            </p>

            {/* INPUT */}
            <input
              type="file"
              accept="image/*,video/*,audio/*"
              className="form-control mb-3"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;

                const preview = URL.createObjectURL(file);
                setPendingFiles([...pendingFiles, { file, preview }]);
              }}
            />

            {/* BOTÓN GUARDAR */}
            {pendingFiles.length > 0 && (
              <button
                className="btn btn-success mb-3"
                onClick={async () => {
                  for (const item of pendingFiles) {
                    await handleUploadMultimedia(item.file);
                  }
                  setPendingFiles([]);
                }}
              >
                Guardar multimedia
              </button>
            )}

            {/* PREVIEW GRID */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "15px",
              }}
            >
              {/* PENDIENTES */}
              {pendingFiles.map((item, i) => (
                <div
                  key={`pending-${i}`}
                  className="p-2 rounded"
                  style={{
                    background: "rgba(0,0,0,0.25)",
                    border: `1px solid ${activeTheme.border}`,
                  }}
                >
                  {item.file.type.startsWith("image") && (
                    <img
                      src={item.preview}
                      style={{ width: "100%", borderRadius: "8px" }}
                    />
                  )}

                  {item.file.type.startsWith("video") && (
                    <video
                      src={item.preview}
                      controls
                      style={{ width: "100%", borderRadius: "8px" }}
                    />
                  )}

                  {item.file.type.startsWith("audio") && (
                    <audio
                      src={item.preview}
                      controls
                      style={{ width: "100%" }}
                    />
                  )}

                  <button
                    className="btn btn-warning btn-sm w-100 mt-2"
                    onClick={() => {
                      const updated = [...pendingFiles];
                      updated.splice(i, 1);
                      setPendingFiles(updated);
                    }}
                  >
                    Quitar (sin subir)
                  </button>
                </div>
              ))}

              {/* MULTIMEDIA REAL */}
              {(people.multimedia || []).map((item) => (
                <div
                  key={item.id}
                  className="p-2 rounded"
                  style={{
                    background: "rgba(0,0,0,0.25)",
                    border: `1px solid ${activeTheme.border}`,
                  }}
                >
                  {item.type === "image" && (
                    <img
                      src={item.url}
                      style={{ width: "100%", borderRadius: "8px" }}
                    />
                  )}

                  {item.type === "video" && (
                    <video
                      src={item.url}
                      controls
                      style={{ width: "100%", borderRadius: "8px" }}
                    />
                  )}

                  {item.type === "audio" && (
                    <audio
                      src={item.url}
                      controls
                      style={{ width: "100%" }}
                    />
                  )}

                  <button
                    className="btn btn-danger btn-sm w-100 mt-2"
                    onClick={() => handleDeleteMedia(item.id)}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* INSTRUMENTOS */}
          <div className="col-12">
            <div style={{ ...glass, animation: "fadeIn 0.4s ease" }}>
              <h4 className="fw-bold mb-3">Instrumentos</h4>

              <div className="row">

                {/* SELECTOR DE INSTRUMENTO */}
                <div className="col-md-4">

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

                  {/* ESTRELLAS PRO */}
                  <div className="d-flex gap-2 mb-3">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span
                        key={n}
                        style={{
                          cursor: "pointer",
                          fontSize: "2.2rem",
                          color: n <= level ? activeTheme.accent : "#555",
                          transition: "0.2s",
                        }}
                        onMouseEnter={() => setLevel(n)}
                        onClick={() => setLevel(n)}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  <button
                    className="btn btn-primary mb-4 w-100"
                    onClick={() => {
                      if (!selectedInstrument) return;

                      const instObj = allInstruments.find(
                        (i) => i.id == selectedInstrument
                      );

                      const newList = [
                        ...myInstruments,
                        {
                          instrument_id: instObj.id,
                          level: level,
                          instrument: instObj,
                        },
                      ];

                      setMyInstruments(newList);
                      setSelectedInstrument("");
                      setLevel(3);
                    }}
                  >
                    Añadir instrumento
                  </button>
                </div>

                {/* LISTA DE INSTRUMENTOS PRO */}
                <div className="col-md-8">
                  {myInstruments.map((inst, i) => (
                    <div
                      key={i}
                      className="mb-3 p-3 rounded"
                      style={{
                        background: "rgba(0,0,0,0.25)",
                        border: `1px solid ${activeTheme.border}`,
                        animation: "fadeIn 0.4s ease",
                        transition: "0.3s",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-semibold">
                          {inst.instrument?.name || inst.name}
                        </span>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => removeInstrument(inst.instrument_id)}
                        >
                          Eliminar
                        </button>
                      </div>

                      {/* BOLITAS DE NIVEL PRO */}
                      <div className="d-flex gap-2 mt-2">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <div
                            key={n}
                            style={{
                              width: "20px",
                              height: "20px",
                              borderRadius: "50%",
                              backgroundColor:
                                n <= inst.level ? activeTheme.accent : "#444",
                              transition: "0.2s",
                            }}
                          ></div>
                        ))}
                      </div>
                      {/* COMENTARIO DEL INSTRUMENTO */}
                      <textarea
                        className="form-control mt-2"
                        rows="2"
                        placeholder="Comentario sobre este instrumento..."
                        value={inst.comment || ""}
                        onChange={(e) => {
                          const updated = [...myInstruments];
                          updated[i].comment = e.target.value;
                          setMyInstruments(updated);
                        }}
                      ></textarea>
                    </div>
                  ))}

                  <button
                    className="btn btn-success mt-3"
                    onClick={handleSaveInstruments}
                  >
                    Guardar instrumentos
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CUSTOMIZER */}
      {showCustomizer && (
        <div className="text-center mt-5">
          <h5>Temas disponibles</h5>

          <div className="d-flex gap-3 mb-3 justify-content-center">
            {Object.keys(themes).map((t) => (
              <button
                key={t}
                onClick={() => handleThemeChange(t)}
                className="btn btn-sm"
                style={{
                  backgroundColor: themes[t].accent,
                  color: "#fff",
                  border: "none",
                  textTransform: "capitalize",
                }}
              >
                {t}
              </button>
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