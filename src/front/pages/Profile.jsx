import { useAuth } from "../context/AuthContext";

export const Profile = () => {
    const { user, logout } = useAuth();

    return (
        <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "80vh" }}
        >
            <div
                style={{
                    width: "420px",
                    background: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "16px",
                    padding: "2rem",
                    color: "black",
                }}
            >
                <h2 className="text-center mb-4 fw-semibold">
                    Bienvenido a tu perfil
                </h2>

                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Alias:</strong> {user?.alias || "Sin alias"}</p>

                <button
                    className="btn btn-outline-dark w-100 mt-4"
                    onClick={logout}
                >
                    Cerrar sesión
                </button>
            </div>
        </div>
    );
};