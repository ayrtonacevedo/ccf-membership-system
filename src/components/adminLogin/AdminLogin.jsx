import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig/firebase";
import { useNavigate } from "react-router-dom";
import "./adminLogin.css";
import Logo from "../../resources/ccf2.png";

const AdminLogin = () => {
  // const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      setError("Error al iniciar sesión: " + error.message);
    }
  };

  // Redirigir si ya está autenticado
  // if (loading) return <p>Cargando...</p>;
  // if (user) navigate("/dashboard");

  return (
    <div className="bgcontainer">
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="card card-custom p-4">
          {/* <h3 className="text-center mb-4 title">CCF System</h3> */}
          <img src={Logo} alt="CCF Membership System" className="mb-1" />
          {error && <p className="text-danger">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                id="username"
                placeholder="Enter username"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className="form-control"
                id="password"
                placeholder="Enter password"
                required
              />
            </div>
            <button type="submit" className="btn btn-custom w-100">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
