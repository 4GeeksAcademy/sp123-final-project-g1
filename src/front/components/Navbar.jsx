import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import sonora from "../assets/img/sonora.png";



export const Navbar = () => {

  const { user, logout } = useAuth();

	return (
		<nav
			className="navbar navbar-expand-lg fixed-top"
			style={{
				background: "linear-gradient(135deg, #4c5e78, #6d7f9a)", // gris azulado metálico
				boxShadow: "0 4px 12px rgba(0,0,0,0.25)", // elegante sombra sutil
				backdropFilter: "saturate(180%) blur(10px)", // efecto moderno y profesional
				borderBottom: "1px solid rgba(255,255,255,0.1)"
			}}
		>
			<div className="container-fluid">
				<Link to="/">
					<img
						src={logo}
						alt="O"
						style={{ width: "200px", height: "50px", display: "inline-block" }}
					/>
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
};
