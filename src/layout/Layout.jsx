import React from "react";
import Navbar from "./../components/navBar/NavBar"; // Asegúrate de importar tu componente Navbar
import Footer from "./../components/footer/Footer"; // Asegúrate de importar tu componente Footer

const Layout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
