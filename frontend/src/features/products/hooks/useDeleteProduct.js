// useDeleteProduct.js
import { useState } from "react";
import { deleteProduct } from "../services/productService";

export const useDeleteProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDeleteProduct = async (productId, onSuccess) => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteProduct(productId);
      onSuccess?.(); // Llamar a la función de éxito si se proporciona
      return response;
    } catch (err) {
      setError(err.message || "Ocurrió un error al eliminar el producto.");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, handleDeleteProduct };
};
