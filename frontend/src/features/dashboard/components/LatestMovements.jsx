// LatestMovements.jsx
import React from "react";
import styles from "./LatestMovements.module.css";
import { Card } from "@Structure";
import MovementCard from "./MovementCard";
import Skeleton from "@Structure/Skeleton"; // Importa tu componente Skeleton
import useRecentMovements from "../hooks/useRecentMovements";

// Función para transformar ENTRY -> ENTRADA y EXIT -> SALIDA
const translateMovementType = (type) => {
  switch (type) {
    case "ENTRY":
      return "ENTRADA";
    case "EXIT":
      return "SALIDA";
    default:
      return type; // Si el tipo no es conocido, devolverlo tal cual
  }
};

const LatestMovements = () => {
  const { movements, loading, error } = useRecentMovements();

  // Determinar cuántos esqueletos mostrar: usar movements.length si hay datos, o 5 como predeterminado
  const skeletonCount = movements.length > 0 ? movements.length : 1;

  if (loading) {
    // Mostrar esqueletos mientras se cargan los datos
    return (
      <Card className={styles.card}>
        <div className={styles.title}>
          <p>Movimientos recientes</p>
        </div>
        <div className={styles.movements}>
          {[...Array(skeletonCount)].map((_, index) => (
            <MovementCard
              key={index}
              uuid={
                <Skeleton
                  isLoading={true}
                  style={{ width: "100%", height: "20px" }}
                />
              }
              productos={
                <Skeleton
                  isLoading={true}
                  style={{ width: "80px", height: "16px" }}
                />
              }
              usuario={
                <Skeleton
                  isLoading={true}
                  style={{ width: "120px", height: "16px" }}
                />
              }
              tipo={
                <Skeleton
                  isLoading={true}
                  style={{ width: "60px", height: "24px", borderRadius: "4px" }}
                />
              }
            />
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={styles.card}>
        <div className={styles.title}>
          <p>Movimientos recientes</p>
        </div>
        <div className={styles.error}>Error: {error}</div>
      </Card>
    );
  }

  return (
    <Card className={styles.card}>
      <div className={styles.title}>
        <p>Movimientos recientes</p>
      </div>
      <div className={styles.movements}>
        {movements.length > 0 ? (
          movements.map((movement) => (
            <MovementCard
              key={movement.id}
              uuid={movement.id}
              productos={movement.numberOfProducts}
              usuario={movement.createdBy}
              tipo={translateMovementType(movement.type)} // Transformar el tipo aquí
            />
          ))
        ) : (
          <p className={styles.noData}>No hay información disponible</p>
        )}
      </div>
    </Card>
  );
};

export default LatestMovements;
