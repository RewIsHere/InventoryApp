import { useState, useContext } from "react";
import { updateProduct } from "../services/productService";
import { ToastContext } from "../../../shared/context/ToastContext";

export const useEditProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addNotification } = useContext(ToastContext);

  const editProduct = async (productId, productData) => {
    try {
      setLoading(true);
      setError(null);

      // Validar campos requeridos
      const requiredFields = ["name", "barcode", "category_id"];
      const missingFields = requiredFields.filter(
        (field) => !productData[field]
      );

      if (missingFields.length > 0) {
        const errorMessage = `Faltan campos requeridos: ${missingFields.join(
          ", "
        )}.`;
        addNotification(errorMessage, "error");
        return null;
      }

      // Llamar a la API para actualizar el producto
      const response = await updateProduct(productId, productData);

      // Verificamos si la respuesta está presente y no tiene errores
      if (!response) {
        const errorMessage =
          "La respuesta del backend no contiene los datos esperados.";
        addNotification(errorMessage, "error");
        return null;
      }

      // Notificación de éxito
      addNotification("Producto actualizado correctamente.", "success");

      // Devolvemos la respuesta directamente
      return response;
    } catch (error) {
      console.error("Error al actualizar el producto:", error.message || error);
      setError(error.message || "Ocurrió un error al actualizar el producto.");
      addNotification(
        error.message || "Ocurrió un error al actualizar el producto.",
        "error"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, editProduct };
};
