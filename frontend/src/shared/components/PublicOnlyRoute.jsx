import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuthContext();

  if (loading) return <p>Cargando...</p>; // Muestra un indicador de carga mientras se verifica el estado del usuario

  if (user) {
    return <Navigate to="/dashboard" replace />; // Redirige al dashboard si el usuario ya está autenticado
  }

  return children; // Renderiza el contenido si el usuario no está autenticado
};

export default PublicOnlyRoute;