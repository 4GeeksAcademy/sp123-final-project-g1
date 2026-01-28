import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const LoginSignup = () => {
    const [mode, setMode] = useState("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [alias, setAlias] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { login } = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        const endpoint = mode === "login" ? "/login" : "/signup";

        try {
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api${endpoint}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(
                        mode === "login"
                            ? { email, password }
                            : { email, password, alias }
                    ),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Error");
                return;
            }

            if (mode === "login") {
                login(data.results, data.access_token);
                navigate("/profile");
                return;
            }

            alert("Usuario creado correctamente. Ahora puedes iniciar sesión.");
            setMode("login");

        } catch (err) {
            setError("Error de conexión con el servidor");
        }
    }

    return (
        <div className="d-flex justify-content-center" style={{ marginTop: "140px" }}>
            <div
                style={{
                    width: "380px",
                    background: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "16px",
                }}
            >
                <div className="card-body p-4">
                    <h5 className="text-center mb-4 fw-semibold">
                        {mode === "login"
                            ? "Login to SONORA"
                            : "Create your SONORA account"}
                    </h5>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <input
                                type="email"
                                className="form-control bg-transparent text-white border-light"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <input
                                type="password"
                                className="form-control bg-transparent text-white border-light"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {mode === "signup" && (
                            <div className="mb-4">
                                <input
                                    type="text"
                                    className="form-control bg-transparent text-white border-light"
                                    placeholder="Alias"
                                    value={alias}
                                    onChange={(e) => setAlias(e.target.value)}
                                />
                            </div>
                        )}

                        <button type="submit" className="text-dark btn btn-outline-light w-100">
                            {mode === "login" ? "Login" : "Signup"}
                        </button>
                    </form>

                    {error && (
                        <p className="text-danger text-center mt-3">{error}</p>
                    )}

                    <p
                        className="text-center mt-3"
                        style={{ cursor: "pointer", color: "#ccc" }}
                        onClick={() => setMode(mode === "login" ? "signup" : "login")}
                    >
                        {mode === "login"
                            ? "¿No tienes cuenta? Crear una"
                            : "¿Ya tienes cuenta? Inicia sesión"}
                    </p>
                </div>
            </div>
        </div>
    );
};