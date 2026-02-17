// import { Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import logo from "../assets/img/logo.jpg";

// export const Navbar = () => {

// 	const { user, logout } = useAuth();

// 	return (
// 		<nav
// 			className="navbar navbar-expand-lg fixed-top"
// 			style={{
// 				background: "linear-gradient(135deg, #4c5e78, #6d7f9a)", // gris azulado metálico
// 				boxShadow: "0 4px 12px rgba(0,0,0,0.25)", // elegante sombra sutil
// 				backdropFilter: "saturate(180%) blur(10px)", // efecto moderno y profesional
// 				borderBottom: "1px solid rgba(255,255,255,0.1)"
// 			}}
// 		>
// 			<div className="container-fluid">
// 				<Link to="/">
// 					<img
// 						src={logo}
// 						alt="O"
// 						style={{ width: "200px", height: "50px", display: "inline-block" }}
// 					/>
// 				</Link>

// 				<Link to="/about" className="text-white text-decoration-none fw-semibold">
// 					About
// 				</Link>

// 				<div className="d-flex" id="sonoraNav">
// 					{user && (
// 						<Link className="m-1 btn btn-outline-light" to={`/u/${user.alias}`}>
// 							Perfil
// 						</Link>
// 					)}
// 					<Link to="/loginsignup" className="m-1 btn btn-outline-light">
// 						Login / Signup
// 					</Link>
// 				</div>
// 			</div>
// 		</nav>
// 	);
// };


import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/img/logo.png";

export const Navbar = () => {

	const { user, logout } = useAuth();

	return (
		<nav className="navbar navbar-expand-lg fixed-top"
			style={{
				background: "linear-gradient(135deg, #4c5e78, #6d7f9a)", 
				boxShadow: "0 4px 12px rgba(0,0,0,0.25)", 
				backdropFilter: "saturate(180%) blur(10px)", 
				borderBottom: "1px solid rgba(255,255,255,0.1)"
			}}>
			<div className="container-fluid">

				{/* LOGO */}
				<Link to="/" className="navbar-brand">
					<img
						src={logo}
						alt="O"
						style={{ width: "265px", height: "60px" }}
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