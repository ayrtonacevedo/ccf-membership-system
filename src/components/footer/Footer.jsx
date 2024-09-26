import React from "react";

const Footer = () => {
  return (
    <footer className="bg-dark text-light text-center py-3 mt-auto">
      <div className="container">
        <p className="mb-0">
          &copy; {new Date().getFullYear()} CCF Membership System
        </p>
        <p className="mb-0">Todos los derechos reservados</p>
      </div>
    </footer>
  );
};

export default Footer;
