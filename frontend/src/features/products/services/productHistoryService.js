import apiClient from "../../../shared/utils/apiClient";

export const getProductHistory = async (productId) => {
  try {
    // Aquí debes usar el ID del producto para hacer la solicitud a la API de backend
    const response = await apiClient.get(
      `/api/v1/products/${productId}/history`
    );

    // Devuelves los datos con los campos necesarios
    return response.data.map((item) => ({
      id: item.id,
      date: item.date,
      details: item.details,
      user: item.user,
    }));
  } catch (error) {
    console.error("Error al obtener el historial del producto:", error);
    throw new Error("No se pudo obtener el historial");
  }
};
