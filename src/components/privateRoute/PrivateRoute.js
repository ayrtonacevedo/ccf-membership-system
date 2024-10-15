import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false); // Estado para controlar si se verificó la autenticación

  useEffect(() => {
    if (!loading) {
      setHasCheckedAuth(true); // Marca como verificado una vez que se haya cargado
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <p>Cargando...</p>{" "}
        {/* Puedes reemplazar esto por un spinner si lo deseas */}
      </div>
    );
  }

  if (!hasCheckedAuth) {
    return null; // Si aún no se ha verificado la autenticación, no renderizar nada
  }

  if (!user) {
    return <Navigate to="/adminLogin" />; // Redirigir si no hay usuario autenticado
  }

  return children; // Renderizar los hijos si hay usuario autenticado
};

export default PrivateRoute;
