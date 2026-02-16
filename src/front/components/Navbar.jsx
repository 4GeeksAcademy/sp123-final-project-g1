import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/img/logo.jpg";

export const Navbar = () => {

  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg fixed-top bg-primary">
      <div className="container-fluid">

        {/* LOGO */}
        <Link to="/" className="navbar-brand">
          <img
            src={logo}
            alt="O"
            style={{ width: "200px", height: "50px" }}
          />
        </Link>

        <div className="d-flex align-items-center">

          {/* SI HAY USUARIO → DROPDOWN EN LA FOTO */}
          {user && (
            <div className="dropdown">
              <button
                className="btn p-0 border-0 bg-transparent"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src={
                    user.photo_url
                      ? `${import.meta.env.VITE_BACKEND_URL}${user.photo_url}`
                      : "https://via.placeholder.com/40"
                  }
                  alt="Foto"
                  className="rounded-circle border border-light"
                  style={{
                    width: "40px",
                    height: "40px",
                    objectFit: "cover"
                  }}
                />
              </button>

              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link className="dropdown-item" to={`/public-profile/${user.alias}`}>
                    Ver perfil
                  </Link>
                </li>

                <li>
                  <Link className="dropdown-item" to="/profile">
                    Ajustes
                  </Link>
                </li>

                <li><hr className="dropdown-divider" /></li>

                <li>
                  <button className="dropdown-item text-danger" onClick={logout}>
                    Cerrar sesión
                  </button>
                </li>
              </ul>
            </div>
          )}

          {/* SI NO HAY USUARIO → BOTÓN LOGIN */}
          {!user && (
            <Link
              to="/loginsignup"
              className="btn btn-dark rounded-pill px-4 py-2 shadow-sm m-1"
            >
              Login
            </Link>
          )}

        </div>
      </div>
    </nav>
  );
};