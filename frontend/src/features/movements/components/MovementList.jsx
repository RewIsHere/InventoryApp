import React, { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./MovementsList.module.css";
import MovementCard from "./MovementCard";
import { Pagination } from "@DataDisplay";
import useMovementStore from "../../../shared/stores/useMovementStore";

const MovementsList = () => {
  const [searchParams] = useSearchParams();
  const { movements, loading, error, pagination, fetchMovements } =
    useMovementStore();

  const transformTypeForBackend = (type) => {
    if (type === "ENTRADA") return "entry";
    if (type === "SALIDA") return "exit";
    return status;
  };
  const currentFilters = useMemo(
    () => ({
      search: searchParams.get("search") || "",
      type: transformTypeForBackend(searchParams.get("type")) || "",
      page: parseInt(searchParams.get("page") || "1", 10),
    }),
    [searchParams]
  );

  useEffect(() => {
    fetchMovements(currentFilters, currentFilters.page);
  }, [currentFilters, fetchMovements]);

  if (loading && movements.length === 0)
    return <div>Cargando movimientos...</div>;
  if (error) return <div>Ocurrió un error: {error}</div>;
  if (!Array.isArray(movements) || movements.length === 0)
    return <div>No se encontraron movimientos.</div>;

  return (
    <div className={styles.movementsList}>
      {movements.map((movement) => (
        <MovementCard
          key={movement.id}
          id={movement.id}
          type={movement.type == "ENTRY" ? "ENTRADA" : "SALIDA"}
          products={movement.details?.length || 0}
          user={movement.created_by?.name || "Desconocido"}
        />
      ))}

      {pagination.totalPages > 1 && (
        <Pagination totalPages={pagination.totalPages} />
      )}
    </div>
  );
};

export default MovementsList;
