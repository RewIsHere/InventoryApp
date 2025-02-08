import apiClient from "../../../shared/utils/apiClient";

// Iniciar sesión
export const login = async (email, password) => {
  const response = await apiClient.post("/api/v1/auth/login", { email, password });
  return response.data; // Suponemos que la API devuelve accessToken, refreshToken y datos del usuario
};

// Cerrar sesión
export const logout = async () => {
  await apiClient.post("/api/v1/auth/logout");
};