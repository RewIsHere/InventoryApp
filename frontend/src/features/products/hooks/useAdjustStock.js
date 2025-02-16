import { useState } from "react";
import { adjustProductStock } from "../services/productService"; // Asegúrate de importar el servicio

const useAdjustStock = (id) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const adjustStock = async (adjustment, reason) => {
    setLoading(true);
    setError(null);
    try {
      await adjustProductStock(id, adjustment, reason);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { adjustStock, loading, error };
};

export default useAdjustStock;
