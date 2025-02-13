// productService.js
import apiClient from "../../../shared/utils/apiClient";

export const listProducts = async (filters = {}) => {
  try {
    const response = await apiClient.get("/api/v1/products", {
      params: filters,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message || "Error al obtener los productos.");
  }
};

// Eliminar un producto
export const deleteProduct = async (productId) => {
  try {
    const response = await apiClient.delete(`/api/v1/products/${productId}`);
    return response.data; // Suponemos que la API devuelve un mensaje de éxito
  } catch (error) {
    throw new Error(
      error.message || "Ocurrió un error al eliminar el producto."
    );
  }
};
