import apiClient from "../../../shared/utils/apiClient";

// Obtener los 5 movimientos más recientes
export const getRecentMovements = async () => {
  try {
    const response = await apiClient.get("/api/v1/stats/recent-movements");
    return response.data.movements; // Extraemos el array "movements" del cuerpo de la respuesta
  } catch (error) {
    throw new Error(
      error.message || "Error al cargar los movimientos recientes."
    );
  }
};
