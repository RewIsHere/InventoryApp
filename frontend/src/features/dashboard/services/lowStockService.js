import apiClient from "../../../shared/utils/apiClient";

// Función para obtener los productos con stock bajo
export const getLowStockProducts = async () => {
  try {
    const response = await apiClient.get(
      "/api/v1/stats/low-stock-products-details"
    );
    return response.data; // Suponemos que la API devuelve los datos formateados
  } catch (error) {
    console.error("Error fetching low stock products:", error.message);
    throw new Error(
      error.message ||
        "Ocurrió un error al obtener los productos con stock bajo."
    );
  }
};
