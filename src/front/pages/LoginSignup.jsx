import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const LoginSignup = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [mode, setMode] = useState("login");

    const [form, setForm] = useState({
        email: "",
        password: "",
        alias: "",
        country: "",
        city: ""
    });

    // LISTA DE PAÍSES
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

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // VALIDACIÓN DE SIGNUP
        if (mode === "signup") {
            if (!form.alias.trim()) {
                alert("Debes elegir un alias.");
                return;
            }

            if (!form.country) {
                alert("Debes seleccionar un país.");
                return;
            }

            if (form.password.length < 6) {
                alert("La contraseña debe tener al menos 6 caracteres.");
                return;
            }

            // Alias duplicado
            const aliasCheck = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/check-alias/${form.alias}`
            );
            const aliasData = await aliasCheck.json();
            if (aliasData.exists) {
                alert("Ese alias ya está en uso. Elige otro.");
                return;
            }

            // Email duplicado
            const emailCheck = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/check-email/${form.email}`
            );
            const emailData = await emailCheck.json();
            if (emailData.exists) {
                alert("Ese email ya está registrado.");
                return;
            }
        }

        const url =
            mode === "login"
                ? `${import.meta.env.VITE_BACKEND_URL}/api/login`
                : `${import.meta.env.VITE_BACKEND_URL}/api/signup`;

        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });

        const data = await res.json();
        console.log("DATA LOGIN/SIGNUP:", data);

        if (!res.ok) {
            alert(data.message || "Error");
            return;
        }

        // LOGIN
        if (mode === "login") {
            login(data.user, data.token, data.people);
            navigate(`/public-profile/${data.user.alias}`);
            return;
        }

        // SIGNUP
        if (mode === "signup") {
            alert("Cuenta creada. Ahora inicia sesión.");
            setMode("login");
        }
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center vh-100"
            style={{
                background: "linear-gradient(135deg, #0a0a0a, #1a1a1a)",
            }}
        >
            <div
                className="card p-4 text-light"
                style={{
                    width: "380px",
                    background: "rgba(255, 255, 255, 0.08)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "20px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
                }}
            >

                {/* TABS LOGIN / SIGNUP */}
                <ul className="nav nav-pills mb-3 justify-content-center">
                    <li className="nav-item">
                        <button
                            className={`nav-link ${mode === "login" ? "active" : ""}`}
                            onClick={() => setMode("login")}
                        >
                            Login
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${mode === "signup" ? "active" : ""}`}
                            onClick={() => setMode("signup")}
                        >
                            Signup
                        </button>
                    </li>
                </ul>

                {/* FORM */}
                <form onSubmit={handleSubmit}>

                    {/* ALIAS SOLO EN SIGNUP */}
                    {mode === "signup" && (
                        <div className="mb-3">
                            <label className="form-label fw-bold">Alias</label>
                            <input
                                type="text"
                                name="alias"
                                className="form-control bg-dark text-light border-secondary"
                                placeholder="Alias único"
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    {/* EMAIL */}
                    <div className="mb-3">
                        <label className="form-label fw-bold">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control bg-dark text-light border-secondary"
                            placeholder="Email"
                            onChange={handleChange}
                        />
                    </div>

                    {/* PASSWORD */}
                    <div className="mb-3">
                        <label className="form-label fw-bold">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control bg-dark text-light border-secondary"
                            placeholder="Contraseña"
                            onChange={handleChange}
                        />
                    </div>

                    {/* COUNTRY + CITY SOLO EN SIGNUP */}
                    {mode === "signup" && (
                        <>
                            <label className="fw-bold mt-2">País *</label>
                            <select
                                name="country"
                                className="form-control bg-dark text-light border-secondary"
                                value={form.country}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecciona un país</option>
                                {countries.map((c) => (
                                    <option key={c.code} value={c.code}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>

                            <label className="fw-bold mt-2">Ciudad (opcional)</label>
                            <input
                                type="text"
                                name="city"
                                className="form-control bg-dark text-light border-secondary"
                                placeholder="Ciudad"
                                value={form.city}
                                onChange={handleChange}
                            />
                        </>
                    )}

                    {/* SUBMIT */}
                    <button
                        className="btn btn-primary w-100 rounded-pill mt-3"
                        type="submit"
                    >
                        {mode === "login" ? "Entrar" : "Registrarse"}
                    </button>
                </form>

                {/* CAMBIAR MODO */}
                <button
                    className="btn btn-link mt-3 text-light"
                    onClick={() => setMode(mode === "login" ? "signup" : "login")}
                >
                    {mode === "login"
                        ? "¿No tienes cuenta? Regístrate"
                        : "¿Ya tienes cuenta? Inicia sesión"}
                </button>
            </div>
        </div>
    );
};