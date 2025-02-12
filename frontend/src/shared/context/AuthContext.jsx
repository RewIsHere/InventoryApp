import React, { createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/authentication/hooks/useAuth";
import { ToastContext } from "../context/ToastContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const { user, login, logout, forgotPassword, resetPassword, loading } = useAuth();
  const { addNotification } = useContext(ToastContext);

  // Redirigir al dashboard si el usuario ya está autenticado
/*  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);
*/
  // Función para manejar el inicio de sesión
  const handleLogin = async (email, password) => {
    try {
      await login(email, password);
      addNotification("Inicio de sesión exitoso.", "success");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      addNotification(error.message || "Ocurrió un error inesperado.", "error");
    }
  };

  // Función para manejar el cierre de sesión
  const handleLogout = async () => {
    try {
      await logout();
      addNotification("Sesión cerrada exitosamente.", "success");
      navigate("/", { replace: true });
    } catch (error) {
      addNotification("Error al cerrar sesión.", "error");
    }
  };

  // Función para manejar la solicitud de restablecimiento de contraseña
  const handleForgotPassword = async (email) => {
    try {
      const message = await forgotPassword(email);
      addNotification(message, "success");
    } catch (error) {
      addNotification(error.message || "Ocurrió un error al solicitar el restablecimiento de contraseña.", "error");
    }
  };

  // Función para manejar el restablecimiento de contraseña
  const handleResetPassword = async (token, newPassword) => {
    try {
      const message = await resetPassword(token, newPassword);
      addNotification(message, "success");
      navigate("/", { replace: true }); // Redirigir al inicio de sesión después de restablecer la contraseña
    } catch (error) {
      addNotification(error.message || "Ocurrió un error al restablecer la contraseña.", "error");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login: handleLogin, logout: handleLogout, forgotPassword: handleForgotPassword, resetPassword: handleResetPassword, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);