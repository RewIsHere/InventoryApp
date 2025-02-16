// categoryService.js
import apiClient from "../../../shared/utils/apiClient";

// Obtener todas las categorías
export const fetchCategories = async () => {
  try {
    const response = await apiClient.get("/api/v1/products/categories");
    return response.data;
  } catch (error) {
    throw new Error(error.message || "Error al obtener las categorías.");
  }
};

// Crear una nueva categoría
export const createCategory = async (name) => {
  try {
    const response = await apiClient.post("/api/v1/products/categories", {
      name,
    });
    const responseData = response.data;

    // Extraer la categoría del objeto de respuesta
    const newCategory = responseData.category;

    // Validar que la categoría tenga las propiedades necesarias
    if (!newCategory || !newCategory.id || !newCategory.name) {
      throw new Error("La respuesta de la API no tiene el formato esperado.");
    }

    console.log("Categoría extraída:", newCategory); // Agregar este log para depurar
    return newCategory; // Devolver la categoría extraída
  } catch (error) {
    throw new Error(error.message || "Ocurrió un error al crear la categoría.");
  }
};
