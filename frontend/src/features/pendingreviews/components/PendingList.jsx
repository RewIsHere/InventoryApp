import React, { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./PendingList.module.css";
import { usePendingStore } from "../../../shared/stores/usePendingStore";
import PendingCard from "./PendingCard";

const PendingList = () => {
  const [searchParams] = useSearchParams();
  const { pendings, loading, error, fetchPending } = usePendingStore();

  // Filtrado basado en parámetros de búsqueda
  const currentFilters = useMemo(
    () => ({
      search: searchParams.get("search") || "",
    }),
    [searchParams]
  );

  // Efecto para cargar datos cuando cambian los filtros
  useEffect(() => {
    fetchPending(currentFilters);
  }, [currentFilters, fetchPending]);

  // Renderizado condicional
  if (loading && pendings.length === 0) {
    return <div>Cargando movimientos...</div>;
  }

  if (error) {
    return <div>Ocurrió un error: {error}</div>;
  }

  if (!Array.isArray(pendings) || pendings.length === 0) {
    return <div>No se encontraron movimientos.</div>;
  }

  return (
    <div className={styles.movementsList}>
      {pendings.map((pending) => (
        <PendingCard
          key={pending.id}
          id={pending.id}
          type={pending.movement.type === "ENTRY" ? "ENTRADA" : "SALIDA"}
          barcode={pending.barcode}
          user={pending.created_by?.name || "Desconocido"}
        />
      ))}
    </div>
  );
};

export default PendingList;
