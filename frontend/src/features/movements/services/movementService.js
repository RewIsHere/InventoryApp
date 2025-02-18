import apiClient from "../../../shared/utils/apiClient";

export const listMovements = async (filters = {}) => {
  try {
    const response = await apiClient.get("/api/v1/movements", {
      params: filters,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message || "Error al obtener los productos.");
  }
};

// Obtener el último movimiento temporal pendiente
export const getPendingMovementService = async () => {
  try {
    const response = await apiClient.get(`api/v1/movements/pending`);
    return response.data; // Devuelve los datos del movimiento pendiente
  } catch (err) {
    console.error("Error al obtener el movimiento pendiente:", err.message);
    throw err;
  }
};

export const getTempMovementIdService = async () => {
  try {
    const response = await apiClient.get(`/api/v1/movements/pending`);
    console.log("Respuesta del backend:", response); // Verifica la estructura completa
    if (response && response.data) {
      return response.data; // Devuelve toda la respuesta
    } else {
      throw new Error("La respuesta del servidor no es válida.");
    }
  } catch (error) {
    console.error("Error al obtener el movimiento temporal:", error);
    throw new Error("Error al obtener el movimiento temporal.");
  }
};
// Servicio para escanear el producto
export const scanProductService = async (tempMovementId, barcode, quantity) => {
  try {
    const response = await apiClient.post(
      `/api/v1/movements/temp/${tempMovementId}/scan`,
      {
        barcode,
        quantity,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al escanear el producto:", error);
    return { error: "Hubo un error al escanear el producto." };
  }
};

// Servicio para actualizar la cantidad de un producto
export const updateQuantityService = async (
  tempMovementId,
  barcode,
  quantity
) => {
  try {
    const response = await apiClient.put(
      `/api/v1/movements/temp/${tempMovementId}/products/${barcode}/quantity`,
      {
        quantity,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar la cantidad:", error);
    return { error: "Hubo un error al actualizar la cantidad." };
  }
};

// Servicio para eliminar un producto
export const deleteProductService = async (tempMovementId, barcode) => {
  try {
    const response = await apiClient.delete(
      `/api/v1/movements/temp/${tempMovementId}/products/${barcode}`
    );
    return response.data;
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    return { error: "Hubo un error al eliminar el producto." };
  }
};

export const confirmMovementService = async (movementId) => {
  try {
    const response = await apiClient.post(
      `/api/v1/movements/temp/${movementId}/confirm`
    );
    return response.data; // Devuelve la respuesta del backend
  } catch (error) {
    console.error("Error al confirmar el movimiento:", error);
    throw new Error(
      error.response?.data?.error || "Error al confirmar el movimiento."
    );
  }
};

// Eliminar un movimiento temporal y sus detalles
export const deleteTempMovementService = async (tempMovementId) => {
  try {
    console.log(
      "Enviando solicitud para eliminar movimiento temporal. ID:",
      tempMovementId
    );
    const response = await apiClient.delete(
      `/api/v1/movements/temp/${tempMovementId}`
    );
    console.log("Respuesta del backend:", response.data);
    return response.data; // Devuelve la respuesta completa
  } catch (error) {
    console.error("Error al eliminar el movimiento temporal:", error);
    throw new Error(
      error.response?.data?.error || "Error al eliminar el movimiento temporal."
    );
  }
};

export const getMovementDetailsService = async (id) => {
  try {
    const response = await apiClient.get(`/api/v1/movements/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Error al obtener datos");
  }
};
