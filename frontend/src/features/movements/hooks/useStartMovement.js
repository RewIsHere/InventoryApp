import { useState } from "react";
import apiClient from "@/shared/utils/apiClient";

export const useStartMovement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const startMovement = async (movementType) => {
    setLoading(true);
    setError(null);

    try {
      console.log("Iniciando el movimiento..."); // Depuración al iniciar el movimiento
      // Cambiar 'movementType' a 'type' en la solicitud
      const response = await apiClient.post("/api/v1/movements/start", {
        type: movementType, // Aquí cambiamos a 'type'
      });
      console.log("Respuesta del servidor:", response.data); // Ver la respuesta completa

      setLoading(false);

      // Verifica si 'tempMovement' existe en la respuesta
      if (response.data && response.data.tempMovement) {
        console.log(
          "Movimiento iniciado con éxito, ID:",
          response.data.tempMovement.id
        ); // Depuración del ID
        return response.data; // Devuelve la respuesta completa
      } else {
        setError(response.data?.message || "Error desconocido");
      }
    } catch (err) {
      setLoading(false);
      console.error("Error al iniciar el movimiento:", err); // Depuración de errores
      setError("Error al iniciar el movimiento");
    }
  };

  return { startMovement, loading, error };
};
