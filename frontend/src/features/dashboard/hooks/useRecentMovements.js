// .js
import { useState, useEffect } from "react";
import { getRecentMovements } from "../services/movementsService";

const useRecentMovements = () => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovements = async () => {
      try {
        const recentMovements = await getRecentMovements();
        setMovements(recentMovements);
      } catch (err) {
        setError(err.message || "Error al cargar los movimientos recientes.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovements();
  }, []);

  return { movements, loading, error };
};

export default useRecentMovements;
