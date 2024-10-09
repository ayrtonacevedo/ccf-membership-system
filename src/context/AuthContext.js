import React, { createContext, useContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig/firebase";

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, loading, error] = useAuthState(auth);
  if (error) {
    console.error("Error al autenticar:", error);
  }
  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
