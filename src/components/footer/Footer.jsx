import React from "react";
import "./footer.css";
const Footer = () => {
  return (
    <footer className="footer py-3 mt-auto">
      <div className="container text-center">
        <p className="footer-copyright mb-1">
          &copy; {new Date().getFullYear()} CCF Membership System. Todos los
          derechos reservados.
        </p>
        <p className="footer-credits mb-0">
          Desarrollado por <strong>Ayrton Acevedo</strong>.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
