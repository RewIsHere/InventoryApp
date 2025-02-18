import apiClient from "../../../shared/utils/apiClient";

export const updateUserService = async (userId, updates) => {
  const response = await apiClient.patch(`/api/v1/users/${userId}`, updates); // Ajusta la URL de la API según corresponda
  return response.data;
};
