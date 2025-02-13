// categoryService.js
import apiClient from "../../../shared/utils/apiClient";

export const fetchCategories = async () => {
  try {
    const response = await apiClient.get("/api/v1/products/categories");
    return response.data; // Suponemos que la API devuelve un array de categorías
  } catch (error) {
    throw new Error(
      error.message || "Ocurrió un error al cargar las categorías."
    );
  }
};
