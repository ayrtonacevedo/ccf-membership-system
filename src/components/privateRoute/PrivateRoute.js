import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebaseConfig/firebase";

const PrivateRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth); // Añadimos el estado `loading`

  if (loading) {
    // Mostrar el indicador de carga mientras verifica la autenticación
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!user) {
    // Si no hay usuario autenticado, redirigir a la página de login
    return <Navigate to="/adminLogin" />;
  }

  // Si el usuario está autenticado, renderizar el contenido protegido
  return children;
};

export default PrivateRoute;
