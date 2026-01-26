import { Link } from "react-router-dom";

export const Navbar = () => {

	return (
		<nav className="navbar navbar-expand-lg fixed-top" style={{ background: "linear-gradient(to bottom, rgba(128,0,255,0.85), rgba(128,0,255,0))", backdropFilter: "blur(6px)" }}>
			<div className="container-fluid px-4">
				<Link className="navbar-brand text-white fw-semibold" to="/" style={{ letterSpacing: "0.15em" }}> SONORA </Link>
					<div className="collapse navbar-collapse" id="sonoraNav">
						<ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-4">
							<li className="nav-item">
								<Link className="nav-link text-white" to="/explore">Explore</Link>
							</li>
							<li className="nav-item">
								<Link className="nav-link text-white" to="/artists">Artists</Link>
							</li>
						</ul>
						<Link to="/loginsignup" className="btn btn-outline-light">
							Login / Signup
						</Link>
					</div>
			</div>
		</nav>
	);
};