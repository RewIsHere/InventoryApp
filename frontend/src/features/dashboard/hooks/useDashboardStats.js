// useDashboardStats.js
import { useState, useEffect } from "react";
import {
  getTotalProducts,
  getLowStockProducts,
  getMovementStats,
} from "../services/dashboardService";

const useDashboardStats = () => {
  const [stats, setStats] = useState({
    totalProducts: null,
    lowStockProducts: null,
    totalEntries: null,
    totalExits: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Obtener las estadísticas en paralelo
        const [totalProductsData, lowStockProductsData, movementStatsData] =
          await Promise.all([
            getTotalProducts(),
            getLowStockProducts(),
            getMovementStats(),
          ]);

        // Actualizar el estado con los datos obtenidos
        setStats({
          totalProducts: totalProductsData.totalProducts,
          lowStockProducts: lowStockProductsData.lowStockProducts,
          totalEntries: movementStatsData.totalEntries,
          totalExits: movementStatsData.totalExits,
        });
      } catch (err) {
        setError(err.message || "Error al cargar los datos del dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};

export default useDashboardStats;
