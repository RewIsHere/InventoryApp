import apiClient from "../../../shared/utils/apiClient";

export const registerPendingProduct = async (id, productData) => {
  try {
    const response = await apiClient.post(
      `/api/v1/pending-reviews/${id}/register`,
      productData
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Error al registrar el producto."
    );
  }
};
