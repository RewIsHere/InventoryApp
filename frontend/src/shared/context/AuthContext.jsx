import React, { createContext, useContext } from "react";
import { useAuth } from "../../features/authentication/hooks/useAuth";
import { useToast } from "../hooks/useToast";
import Toast  from "../components/toast/Toast"

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { user, login, logout, loading } = useAuth();
  const { toast, showToast } = useToast();

  const handleLogin = async (email, password) => {
    try {
      await login(email, password);
    } catch (error) {
      showToast(error.message || "Ocurrió un error inesperado.", "error");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      showToast("Error al cerrar sesión.", "error");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login: handleLogin, logout: handleLogout, loading }}>
      {children}
      {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => showToast("", "")} />}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);