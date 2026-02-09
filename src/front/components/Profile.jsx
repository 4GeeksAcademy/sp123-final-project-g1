import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { InstrumentSelector } from "../components/InstrumentSelector";

export const Profile = () => {
  const { user, people, token, setPeople, setUser } = useAuth();

  // Estados
  const [bio, setBio] = useState(people?.bio || "");
  const [instrumentList, setInstrumentList] = useState([]);
  const [myInstruments, setMyInstruments] = useState(people?.instruments || []);
  const [background, setBackground] = useState(user.background || "");
  const [songUrl, setSongUrl] = useState(user.song_url || "");
  const [photoFile, setPhotoFile] = useState(null);
  const [roles, setRoles] = useState({
    is_musician: people?.is_musician || false,
    is_dj: people?.is_dj || false,
    is_singer: people?.is_singer || false,
    is_composer: people?.is_composer || false,
    is_teacher: people?.is_teacher || false,
    is_light_tech: people?.is_light_tech || false,
    is_sound_tech: people?.is_sound_tech || false,
    is_producer: people?.is_producer || false,
    is_fan: people?.is_fan || true
  });

  const handleSaveRoles = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/update-roles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(roles)
    });

    const data = await res.json();
    if (res.ok) setPeople(data.people);
  };

  // Cargar lista de instrumentos
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/instruments`)
      .then(res => res.json())
      .then(data => setInstrumentList(data));
  }, []);

  // -----------------------------
  // GUARDAR BIO
  // -----------------------------
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

  // -----------------------------
  // GUARDAR INSTRUMENTOS
  // -----------------------------
  const handleSaveInstruments = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/update-instruments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ instruments: myInstruments })
    });

    const data = await res.json();
    if (res.ok) setPeople(data.people);
  };

  const removeInstrument = (id) => {
    setMyInstruments(myInstruments.filter(inst => inst.instrument_id !== id));
  };

  // -----------------------------
  // GUARDAR BACKGROUND
  // -----------------------------
  const handleSaveBackground = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/update-background`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ background })
    });

    const data = await res.json();
    if (res.ok) setUser(data.user);
  };

  // -----------------------------
  // GUARDAR CANCIÓN
  // -----------------------------
  const handleSaveSong = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/update-song`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ song_url: songUrl })
    });

    const data = await res.json();
    if (res.ok) setUser(data.user);
  };

  // -----------------------------
  // GUARDAR FOTO DE PERFIL
  // -----------------------------
  const handleUploadPhoto = async () => {
    if (!photoFile) return;

    const formData = new FormData();
    formData.append("photo", photoFile);

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/update-photo`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    const data = await res.json();
    if (res.ok) setUser(data.user);
  };

  return (
    <div
      className="py-5"
      style={{
        backgroundColor: user.background || "#121212",
        color: "#fff",
        minHeight: "100vh"
      }}>
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

          <button className="btn btn-success mt-3" onClick={handleSaveSong}>
            Guardar canción
          </button>
        </div>

        {/* BIO */}
        <div className="mb-5">
          <label className="form-label fw-bold">Biografía</label>
          <textarea
            className="form-control bg-dark text-light"
            rows="4"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          ></textarea>

          <button className="btn btn-success mt-3" onClick={handleSaveBio}>
            Guardar biografía
          </button>
        </div>

        <div className="mb-5">
          <h4 className="fw-bold mb-3">Roles</h4>

          {Object.keys(roles).map((key) => (
            <div key={key} className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                checked={roles[key]}
                onChange={(e) =>
                  setRoles({ ...roles, [key]: e.target.checked })
                }
                id={key}
              />
              <label className="form-check-label" htmlFor={key}>
                {key.replace("is_", "").replace("_", " ").toUpperCase()}
              </label>
            </div>
          ))}

          <button className="btn btn-success mt-3" onClick={handleSaveRoles}>
            Guardar roles
          </button>
        </div>

        {/* INSTRUMENTOS */}
        <div className="mb-5">
          <h4 className="fw-bold mb-3">Instrumentos</h4>

          <InstrumentSelector
            instrumentsList={instrumentList}
            onAdd={(inst) => {
              if (!myInstruments.some(i => i.instrument_id === inst.instrument_id)) {
                setMyInstruments([...myInstruments, inst]);
              }
            }}
          />

          {myInstruments.length > 0 ? (
            myInstruments.map((inst, i) => {
              const instrumentData = instrumentList.find(x => x.id === inst.instrument_id);

              return (
                <div
                  key={i}
                  className="d-flex justify-content-between align-items-center bg-dark p-3 rounded mb-2"
                >
                  <div>
                    <strong>{instrumentData?.name}</strong>
                    <div className="d-flex gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map(n => (
                        <span
                          key={n}
                          style={{
                            color: n <= inst.level ? "#ff9900" : "#555",
                            fontSize: "1.3rem"
                          }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeInstrument(inst.instrument_id)}
                  >
                    Eliminar
                  </button>
                </div>
              );
            })
          ) : (
            <p className="text-muted">No has añadido instrumentos aún.</p>
          )}

          <button className="btn btn-success mt-3" onClick={handleSaveInstruments}>
            Guardar instrumentos
          </button>
        </div>
      </div>
    </div>
  );
};