import { useState, useEffect } from "react";
import { getMovementDetailsService } from "../services/movementService";

export const useMovementDetails = (id) => {
  const [movement, setMovement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return; // Evita ejecutar la petición si no hay un id válido

    const fetchMovementDetails = async () => {
      try {
        setLoading(true);
        const data = await getMovementDetailsService(id);
        setMovement(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovementDetails();
  }, [id]);

  return { movement, loading, error };
};
