import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {

	const { user } = useAuth(); //obtener alias

	return (
		<nav className="navbar navbar-expand-lg fixed-top" style={{ background: "rgba(146, 142, 149, 0.85)" }}>
			<div className="container-fluid px-4">
				<Link className="navbar-brand text-dark fw-semibold" to="/" style={{ letterSpacing: "0.15em" }}>
					SONORA
				</Link>

				<div className="collapse navbar-collapse" id="sonoraNav">
					<ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-4">
						<li className="nav-item">
							<Link className="nav-link text-white" to="/explore">Explore</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link text-white" to="/artists">Artists</Link>
						</li>

						{/* Enlace al perfil público */}
						{user && (
							<li className="nav-item">
								<Link className="nav-link text-white" to={`/u/${user.alias}`}>
									Perfil
								</Link>
							</li>
						)}
					</ul>

					<Link to="/loginsignup" className="btn btn-outline-light">
						Login / Signup
					</Link>
				</div>
			</div>
		</nav>
	);
};