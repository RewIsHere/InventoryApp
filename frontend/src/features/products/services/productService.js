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

export const createProduct = async (productData) => {
  const response = await apiClient.post("/api/v1/products", productData);
  return response.data; // Suponemos que la API devuelve los datos del producto creado
};

export const uploadProductImage = async (productId, file) => {
  try {
    console.log(
      "Enviando solicitud POST para subir imagen, ID del producto:",
      productId,
      "Archivo:",
      file
    );

    const formData = new FormData();
    formData.append("image", file);

    const response = await apiClient.post(
      `/api/v1/products/${productId}/upload-image`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    console.log("Respuesta del backend al subir imagen:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error al subir la imagen:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.error || "Error al subir la imagen.");
  }
};

export const getProductById = async (productId) => {
  try {
    const response = await apiClient.get(
      `/api/v1/products/${productId}/details`
    );
    return response.data; // Suponemos que la API devuelve los datos del producto
  } catch (error) {
    console.error(
      "Error al obtener el producto:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.error || "Error al obtener el producto."
    );
  }
};

export const updateProduct = async (productId, productData) => {
  const response = await apiClient.put(
    `/api/v1/products/${productId}`,
    productData
  );
  return response.data; // Devolvemos la respuesta directamente
};

export const toggleProductStatus = async (productId, status) => {
  try {
    const response = await apiClient.put(
      `/api/v1/products/${productId}/status`,
      {
        status, // 'ACTIVE' o 'INACTIVE'
      }
    );
    return response.data; // Suponemos que la API devuelve un mensaje de éxito
  } catch (error) {
    throw new Error(
      error.message || "Ocurrió un error al actualizar el estado del producto."
    );
  }
};

export const adjustProductStock = async (id, adjustment, reason) => {
  try {
    const response = await apiClient.post(
      `/api/v1/products/${id}/adjust-stock`,
      {
        adjustment,
        reason,
      }
    );
    return response.data; // Respuesta del servidor
  } catch (error) {
    throw new Error(error.message || "Error al ajustar el stock.");
  }
};
