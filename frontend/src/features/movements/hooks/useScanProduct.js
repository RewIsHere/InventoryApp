import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  scanProductService,
  updateQuantityService,
  deleteProductService,
  getTempMovementIdService,
  confirmMovementService,
} from "../services/movementService";

export const useScanProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scannedProducts, setScannedProducts] = useState([]);
  const [tempMovement, setTempMovement] = useState(null); // Almacena toda la respuesta
  const navigate = useNavigate();

  // Función para obtener el movimiento temporal completo
  const fetchTempMovement = async () => {
    try {
      setLoading(true);
      const movementData = await getTempMovementIdService();
      console.log("Movimiento obtenido del servicio:", movementData);

      if (movementData && movementData.id) {
        setTempMovement(movementData);

        // Si hay productos en details, llenarlos en la tabla
        if (movementData.details && movementData.details.length > 0) {
          setScannedProducts(movementData.details);
        } else {
          setScannedProducts([]); // Si no hay productos, limpiar la tabla
        }
      } else {
        setError("No se pudo obtener un movimiento válido del servidor.");
      }
    } catch (err) {
      setError("No se pudo obtener el movimiento temporal.");
      navigate("/movements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTempMovement();
  }, []);

  // Función para escanear un producto
  const scanProduct = async (barcode, quantity, movementId) => {
    if (!barcode || quantity <= 0) {
      setError("Por favor, ingresa un código de barras y cantidad válidos.");
      return;
    }
    if (!movementId) {
      setError("No se ha encontrado un movimiento temporal.");
      return;
    }
    setLoading(true);
    try {
      const response = await scanProductService(movementId, barcode, quantity);
      if (response.error) {
        setError(response.error);
      } else {
        setScannedProducts((prev) => {
          const existingProductIndex = prev.findIndex(
            (product) => product.barcode === barcode
          );
          if (existingProductIndex !== -1) {
            // Si el producto ya existe, reemplazar su cantidad con la del backend
            const updatedProducts = [...prev];
            updatedProducts[existingProductIndex] = {
              ...updatedProducts[existingProductIndex],
              quantity: response.product.quantity, // Usar la cantidad del backend
            };
            return updatedProducts;
          } else {
            // Si el producto no existe, agregarlo
            return [...prev, { barcode, quantity: response.product.quantity }]; // Usar la cantidad del backend
          }
        });
      }
    } catch (err) {
      setError("Hubo un error al escanear el producto.");
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar la cantidad de un producto escaneado
  const updateQuantity = async (barcode, newQuantity, movementId) => {
    if (!newQuantity || newQuantity <= 0 || !movementId) return;
    setLoading(true);
    try {
      const response = await updateQuantityService(
        movementId,
        barcode,
        newQuantity
      );
      if (response.error) {
        setError(response.error);
      } else {
        setScannedProducts((prev) =>
          prev.map((product) =>
            product.barcode === barcode
              ? { ...product, quantity: newQuantity }
              : product
          )
        );
      }
    } catch (err) {
      setError("Hubo un error al actualizar la cantidad.");
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar un producto escaneado
  const deleteProduct = async (barcode, movementId) => {
    if (!movementId) return;
    setLoading(true);
    try {
      const response = await deleteProductService(movementId, barcode);
      if (response.error) {
        setError(response.error);
      } else {
        setScannedProducts((prev) =>
          prev.filter((product) => product.barcode !== barcode)
        );
      }
    } catch (err) {
      setError("Hubo un error al eliminar el producto.");
    } finally {
      setLoading(false);
    }
  };

  // Función para confirmar el movimiento
  const confirmMovement = async (tempMovementId) => {
    if (!tempMovementId) {
      setError("No se ha encontrado un movimiento temporal para confirmar.");
      return;
    }
    try {
      setLoading(true);
      const response = await confirmMovementService(tempMovementId);
      console.log("Respuesta del backend:", response); // Log de depuración
      if (
        response.unregisteredProducts &&
        response.unregisteredProducts.length > 0
      ) {
        setError(
          "Movimiento confirmado correctamente, pero hay productos no registrados pendientes."
        );
        return response.unregisteredProducts; // Devuelve los productos no registrados
      } else {
        setError(null); // Limpia errores anteriores
        return null; // No hay productos no registrados
      }
    } catch (err) {
      console.error("Error en confirmMovement:", err.message); // Log de depuración
      setError(err.message || "Error al confirmar el movimiento.");
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar productos no registrados
  const handleUnregisteredProducts = async (movementId, products) => {
    if (!movementId || !products || products.length === 0) return;
    setLoading(true);
    try {
      const response = await handleUnregisteredProductsService(
        movementId,
        products
      );
      if (response.error) {
        setError(response.error);
      } else {
        setError(null); // Limpia errores anteriores
        return response; // Devuelve la respuesta del backend
      }
    } catch (err) {
      setError("Hubo un error al manejar los productos no registrados.");
    } finally {
      setLoading(false);
    }
  };

  return {
    scanProduct,
    updateQuantity,
    deleteProduct,
    tempMovement,
    scannedProducts,
    loading,
    error,
    fetchTempMovement, // Exponemos la función fetchTempMovementId
    confirmMovement,
  };
};
