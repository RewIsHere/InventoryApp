import { useState, useEffect } from "react";
import { login as apiLogin, logout as apiLogout } from "../services/authService";
import axios from "axios";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar el usuario al iniciar
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          const response = await axios.get("http://localhost:3000/api/v1/auth/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // Función para iniciar sesión
  const login = async (email, password) => {
    const { accessToken, refreshToken, user } = await apiLogin(email, password);
    localStorage.setItem("authToken", accessToken); // Guardar el token en localStorage
    localStorage.setItem("refreshToken", refreshToken); // Guardar el refresh token
    setUser(user);
  };

  // Función para cerrar sesión
  const logout = async () => {
    await apiLogout();
    localStorage.removeItem("authToken"); // Eliminar el token
    localStorage.removeItem("refreshToken"); // Eliminar el refresh token
    setUser(null);
  };

  return { user, login, logout, loading };
};