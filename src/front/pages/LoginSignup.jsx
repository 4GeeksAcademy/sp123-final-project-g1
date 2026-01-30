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
        alias: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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
        console.log("DATA:", data);

        if (!res.ok) {
            alert(data.message || "Error");
            return;
        }

        if (mode === "login") {
            login(data.results, data.access_token, data.people);
            navigate("/profile");
            return;
        }

        if (mode === "signup") {
            alert("Cuenta creada. Ahora inicia sesión.");
            setMode("login");
        }
    };

    return (
        <div className="container py-5 text-dark mt-5">
            <h2 className="mb-4">{mode === "login" ? "Iniciar sesión" : "Crear cuenta"}</h2>

            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                {mode === "signup" && (
                    <input
                        type="text"
                        name="alias"
                        placeholder="Alias"
                        className="form-control"
                        onChange={handleChange}
                    />
                )}

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="form-control"
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    className="form-control"
                    onChange={handleChange}
                />

                <button className="btn btn-primary" type="submit">
                    {mode === "login" ? "Entrar" : "Registrarse"}
                </button>
            </form>

            <button
                className="btn btn-link mt-3 text-dark"
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
            >
                {mode === "login"
                    ? "¿No tienes cuenta? Regístrate"
                    : "¿Ya tienes cuenta? Inicia sesión"}
            </button>
        </div>
    );
};