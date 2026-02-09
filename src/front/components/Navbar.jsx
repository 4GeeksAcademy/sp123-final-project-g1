import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/img/logo.jpg";

export const Navbar = () => {

	const { user } = useAuth();

	return (
		<nav className="navbar navbar-expand-lg fixed-top" style={{ background: "rgb(76, 78, 216)" }}>
			<div className="container-fluid">
				<Link to="/">
					<img src={logo} alt="O" style={{ width: "200px", height: "50px", display: "inline-block" }} />
				</Link>
				<div className="d-flex" id="sonoraNav">
					{user && (
						<Link className="m-1 btn btn-outline-light" to={`/u/${user.alias}`}>
							Perfil
						</Link>)}
					<Link to="/loginsignup" className="m-1 btn btn-outline-light">
						Login / Signup
					</Link>
				</div>
			</div>
		</nav>
	);
}

