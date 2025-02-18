import { useState } from "react";
import { registerPendingProduct } from "../services/registerPendingProductService";

export const useRegisterPendingProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para enviar los datos del formulario al backend
  const handleSubmit = async (id, formData) => {
    try {
      setLoading(true);
      setError(null);

      // Llamar al servicio para registrar el producto pendiente
      const data = await registerPendingProduct(id, formData);

      return data; // Devolver los datos de respuesta si es necesario
    } catch (err) {
      setError(err.message || "Ocurrió un error al registrar el producto.");
      throw err; // Propagar el error para manejarlo en el componente
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    handleSubmit,
  };
};
