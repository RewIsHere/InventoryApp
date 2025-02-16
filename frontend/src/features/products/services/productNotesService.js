import apiClient from "../../../shared/utils/apiClient";

// Servicio para obtener las notas de un producto
export const getProductNotes = async (productId) => {
  try {
    const response = await apiClient.get(`/api/v1/products/${productId}/notes`);
    return response.data; // Devuelve las notas obtenidas de la API
  } catch (error) {
    console.error("Error al obtener las notas del producto:", error);
    throw new Error("No se pudo obtener las notas");
  }
};

// Servicio para crear una nueva nota para un producto
export const createProductNote = async (productId, noteContent) => {
  try {
    const response = await apiClient.post(
      `/api/v1/products/${productId}/notes`,
      {
        note: noteContent,
      }
    );
    return response.data.note; // Devuelve la nota creada
  } catch (error) {
    console.error("Error al crear la nota:", error);
    throw new Error("No se pudo crear la nota");
  }
};
