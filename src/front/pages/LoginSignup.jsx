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

        // VALIDACIÓN DE SIGNUP
        if (mode === "signup") {

            if (!form.alias.trim()) {
                alert("Debes elegir un alias.");
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
        <div className="container py-5 text-dark mt-5">
            <h2 className="mb-4">{mode === "login" ? "Iniciar sesión" : "Crear cuenta"}</h2>

            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                {mode === "signup" && (
                    <input
                        type="text"
                        name="alias"
                        placeholder="Alias (único)"
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