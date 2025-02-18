import apiClient from "../../../shared/utils/apiClient";

export const listUsers = async (queryParams = {}) => {
  const filteredParams = {};

  if (queryParams.search) filteredParams.search = queryParams.search;
  if (queryParams.role) filteredParams.role = queryParams.role;
  if (queryParams.page) filteredParams.page = queryParams.page;
  if (queryParams.limit) filteredParams.limit = queryParams.limit;

  try {
    const response = await apiClient.get("/api/v1/users", {
      params:
        Object.keys(filteredParams).length > 0 ? filteredParams : undefined,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error al obtener usuarios"
    );
  }
};

export const getUserDetailsService = async (userId) => {
  try {
    const response = await apiClient.get(`/api/v1/users/${userId}`);
    return response.data; // Se asume que la API devuelve los datos del usuario
  } catch (error) {
    throw new Error("Error al obtener los datos del usuario");
  }
};

export const deleteUserService = async (userId) => {
  const response = await apiClient.delete(`/api/v1/users/${userId}`);
  return response.data;
};

export const registerUserService = async (userData) => {
  const response = await apiClient.post("/api/v1/auth/register", userData);
  return response.data; // Retorna la respuesta con el mensaje y usuario creado
};
