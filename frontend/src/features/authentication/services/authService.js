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

// Solicitar restablecimiento de contraseña
export const forgotPassword = async (email) => {
  const response = await apiClient.post("/api/v1/auth/forgot-password", { email });
  return response.data;
};

// Restablecer contraseña
export const resetPassword = async (token, newPassword) => {
  const response = await apiClient.put("/api/v1/auth/reset-password", { token, newPassword });
  return response.data;
};

// Validar el token de restablecimiento de contraseña
export const validateResetTokenService = async (token) => {
    const response = await apiClient.post("/api/v1/auth/validate-reset-token", { token });
    return response.data; // Suponemos que la API devuelve un mensaje de éxito
};