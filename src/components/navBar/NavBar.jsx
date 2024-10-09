import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig/firebase";
import logo from "../../resources/ccf2.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/adminLogin");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{ backgroundColor: "#023059" }}
    >
      <div className="container-fluid">
        <Link to="/">
          <img
            src={logo}
            alt="logo"
            style={{ width: "150px", height: "50px" }}
          />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
          id="navbarNav"
        >
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link text-light" to="/dashboard">
                Dashboard
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link text-light" to="/createMember">
                Create Member
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/findMember">
                Find Member
              </Link>
            </li>
            <li className="nav-item">
              <button
                className="btn"
                onClick={handleLogout}
                style={{ backgroundColor: "#02732A", color: "#F2F2F2" }} // Verde intenso
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
