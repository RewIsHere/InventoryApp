import { useState, useEffect } from "react";
import { getPendingMovementService } from "../services/movementService";

export const usePendingMovement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pendingProducts, setPendingProducts] = useState([]);
  const [tempMovementId, setTempMovementId] = useState(null);

  // Función para obtener el movimiento pendiente
  const fetchPendingMovement = async () => {
    try {
      setLoading(true);
      const pendingMovement = await getPendingMovementService();

      if (
        pendingMovement &&
        pendingMovement.details &&
        pendingMovement.details.length > 0
      ) {
        // Si hay un movimiento pendiente, cargar sus detalles
        setPendingProducts(
          pendingMovement.details.map((detail) => ({
            barcode: detail.barcode,
            quantity: detail.quantity,
          }))
        );
        setTempMovementId(pendingMovement.id); // Almacenar el ID del movimiento pendiente
      } else {
        setError("No hay movimientos pendientes.");
      }
    } catch (err) {
      setError("Error al obtener el movimiento pendiente.");
    } finally {
      setLoading(false);
    }
  };

  // Ejecutar solo una vez cuando el componente se monta
  useEffect(() => {
    fetchPendingMovement();
  }, []);

  return {
    pendingProducts,
    tempMovementId,
    loading,
    error,
    fetchPendingMovement, // Exponemos la función para recargar manualmente si es necesario
  };
};
