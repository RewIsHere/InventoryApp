import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Agregar interceptor para adjuntar el token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Agregar interceptor para manejar errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Si hay una respuesta de error, lanzar un error con el cuerpo de la respuesta
      const errorMessage =
        error.response.data?.error || "Ocurrió un error inesperado.";
      throw new Error(errorMessage);
    } else if (error.request) {
      // Si no hay respuesta del servidor, lanzar un error de conexión
      throw new Error("No se pudo conectar con el servidor.");
    } else {
      // Otros errores
      throw new Error("Ocurrió un error inesperado.");
    }
  }
);

export default apiClient;
