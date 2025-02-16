import { useState, useContext } from "react";
import { createProduct, uploadProductImage } from "../services/productService";
import { ToastContext } from "../../../shared/context/ToastContext";
import { useNavigate } from "react-router-dom";

export const useCreateProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { addNotification } = useContext(ToastContext);

  // Función para crear un producto
  const createNewProduct = async (productData) => {
    try {
      setLoading(true);
      setError(null);

      // Validar campos requeridos
      const requiredFields = [
        "name",
        "barcode",
        "stock",
        "min_stock",
        "category_id",
      ];
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

      // Llamar a la API para crear el producto
      const response = await createProduct(productData);

      if (!response || !response.product) {
        const errorMessage =
          "La respuesta del backend no contiene el producto esperado.";
        addNotification(errorMessage, "error");
        return null;
      }

      // Notificación de éxito ya está manejada aquí
      addNotification("Producto creado correctamente.", "success");
      navigate("/products");

      return response;
    } catch (error) {
      console.error("Error al crear el producto:", error.message || error);
      setError(error.message || "Ocurrió un error al crear el producto.");
      addNotification(
        error.message || "Ocurrió un error al crear el producto.",
        "error"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Función para subir una imagen
  const uploadImage = async (productId, file) => {
    try {
      setLoading(true);
      setError(null);

      if (!file) {
        const errorMessage = "No se proporcionó ninguna imagen.";
        addNotification(errorMessage, "error");
        return null;
      }

      const uploadedImage = await uploadProductImage(productId, file);

      if (!uploadedImage || !uploadedImage.url) {
        const errorMessage =
          "La respuesta del backend no contiene la URL de la imagen.";
        addNotification(errorMessage, "error");
        return null;
      }

      // Notificación de éxito ya está manejada aquí
      addNotification("Imagen subida correctamente.", "success");
      return uploadedImage;
    } catch (err) {
      console.error("Error al subir la imagen:", err.message || err);
      setError(err.message || "Ocurrió un error al subir la imagen.");
      addNotification(
        err.message || "Ocurrió un error al subir la imagen.",
        "error"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, createNewProduct, uploadImage };
};
