// Stats.jsx
import React from "react";
import styles from "./Stats.module.css";
import StatCard from "./StatCard";
import BoxIcon from "@Assets/Box.svg?react";
import GraphDownIcon from "@Assets/GraphDown.svg?react";
import EntryExitIcon from "@Assets/EntryExit.svg?react";
import Skeleton from "@Structure/Skeleton"; // Importa tu componente Skeleton
import useDashboardStats from "../hooks/useDashboardStats";

const Stats = () => {
  const { stats, loading, error } = useDashboardStats();

  if (loading) {
    // Mostrar esqueletos mientras se cargan los datos
    return (
      <div className={styles.container}>
        {[...Array(3)].map((_, index) => (
          <StatCard
            key={index}
            icon={
              <Skeleton
                isLoading={true}
                style={{ width: "50px", height: "50px", borderRadius: "8px" }}
              />
            }
            nombre={
              <Skeleton
                isLoading={true}
                style={{ width: "120px", height: "20px" }}
              />
            }
            valor={<Skeleton isLoading={true} style={{ marginTop: "10px" }} />}
          />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <StatCard
        icon={<BoxIcon />}
        nombre="TOTAL DE PRODUCTOS"
        valor={stats.totalProducts?.toLocaleString() || "N/A"}
      />
      <StatCard
        icon={<GraphDownIcon />}
        nombre="PRODUCTOS CON BAJO STOCK"
        valor={stats.lowStockProducts?.toLocaleString() || "N/A"}
      />
      <StatCard
        icon={<EntryExitIcon />}
        nombre="TOTAL DE ENTRADAS Y SALIDAS"
        valor={`${stats.totalEntries?.toLocaleString() || "N/A"} y ${
          stats.totalExits?.toLocaleString() || "N/A"
        }`}
      />
    </div>
  );
};

export default Stats;
