import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Para acceder a los parámetros de la URL
import { getProductHistory } from "../services/productHistoryService"; // Asegúrate de ajustar la ruta al servicio

export const useProductHistory = () => {
  const { id } = useParams(); // Obtiene el ID del producto desde la URL
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductHistory = async () => {
      try {
        const data = await getProductHistory(id); // Pasa el ID del producto al servicio
        setTimelineData(data);
      } catch (err) {
        setError("No se pudo cargar el historial.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductHistory();
    }
  }, [id]); // Solo vuelve a ejecutarse si el ID cambia

  return { timelineData, loading, error };
};
