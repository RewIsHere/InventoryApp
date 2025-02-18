import apiClient from "../../../shared/utils/apiClient";

export const listPending = async (filters = {}) => {
  try {
    const response = await apiClient.get("/api/v1/pending-reviews", {
      params: filters,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message || "Error al obtener los productos.");
  }
};
