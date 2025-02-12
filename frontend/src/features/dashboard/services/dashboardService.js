import apiClient from "../../../shared/utils/apiClient";

// Obtener el número total de productos
export const getTotalProducts = async () => {
  const response = await apiClient.get("/api/v1/stats/total-products");
  return response.data;
};

// Obtener el número de productos con stock bajo
export const getLowStockProducts = async () => {
  const response = await apiClient.get(
    "/api/v1/stats/total-low-stock-products"
  );
  return response.data;
};

// Obtener el número total de entradas y salidas
export const getMovementStats = async () => {
  const response = await apiClient.get("/api/v1/stats/movement-stats");
  return response.data;
};
