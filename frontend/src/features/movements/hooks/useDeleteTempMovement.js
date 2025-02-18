import { useState } from "react";
import { deleteTempMovementService } from "../services/movementService";

export const useDeleteTempMovement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para eliminar un movimiento temporal
  const deleteTempMovement = async (tempMovementId) => {
    if (!tempMovementId) {
      setError("No se ha proporcionado un ID de movimiento temporal válido.");
      return;
    }

    try {
      setLoading(true);
      const response = await deleteTempMovementService(tempMovementId);
      console.log(
        "Movimiento temporal eliminado correctamente:",
        response.message
      );
      setError(null); // Limpia errores anteriores
      return response; // Devuelve la respuesta del backend
    } catch (err) {
      console.error("Error en deleteTempMovement:", err.message);
      setError(err.message || "Error al eliminar el movimiento temporal.");
    } finally {
      setLoading(false);
    }
  };

  return { deleteTempMovement, loading, error };
};
