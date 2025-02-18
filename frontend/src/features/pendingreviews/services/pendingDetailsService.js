import apiClient from "../../../shared/utils/apiClient";

export const fetchPendingProductDetails = async (id) => {
  try {
    const response = await apiClient.get(`/api/v1/pending-reviews/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error ||
        "Error al cargar los detalles del producto."
    );
  }
};
