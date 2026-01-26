

import { Link } from "react-router-dom";


export const LoginSignup = () => {
    return (
        <div className="d-flex justify-content-center" style={{ marginTop: "140px" }}>
            <div className="" style={{ width: "380px", background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.15)",borderRadius: "16px"}}>
                <div className="card-body p-4">
                    <h5 className="text-center mb-4 fw-semibold"> Create your SONORA account</h5>
                    <form>
                        <div className="mb-3">
                            <input type="email" className="form-control bg-transparent text-white border-light" placeholder="Email"/>
                        </div>
                        <div className="mb-4">
                            <input type="password" className="form-control bg-transparent text-white border-light" placeholder="Password"/>
                        </div>
                        <button type="submit" className="text-dark btn btn-outline-light w-100">
                            Login / Signup
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
