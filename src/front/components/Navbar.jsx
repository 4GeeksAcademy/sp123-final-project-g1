import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import sonora from "../assets/img/sonora.png";



export const Navbar = () => {

  const { user } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg fixed-top" style={{ background: "rgb(76, 78, 216)" }}>
      <div className="container-fluid">
        <Link to="/" className="text-decoration-none">
          <img src={sonora} alt="O" style={{ width: "300px", height: "60px", display: "inline-block" }} />
          <Link to="/about" className="border-start ps-3 ms-3 text-white text-decoration-none" style={{ fontSize: "1.2rem", fontWeight: "500" }}>
            About Us
          </Link>
        </Link>
        <div className="d-flex" id="sonoraNav">
          {user && (
            <Link className="m-1 btn btn-outline-light" to={`/u/${user.alias}`}>
              Perfil
            </Link>
          )}
          <Link to="/loginsignup" className="m-1 btn btn-outline-light">
            Login / Signup
          </Link>
        </div>
      </div>
    </nav>

  );
}

