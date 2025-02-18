import React from "react";
import { useParams } from "react-router-dom";
import styles from "./MovementDetails.module.css";
import { Card } from "@Structure";
import { NavIconButton } from "@Buttons";
import BackIcon from "@Assets/Back.svg?react";
import { useMovementDetails } from "../hooks/useMovementDetails";
import { Table } from "@/shared/components/data-display";
import { formatInTimeZone } from "date-fns-tz";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const MovementDetails = () => {
  const { id } = useParams();
  const { movement, loading, error } = useMovementDetails(id);

  if (loading) {
    return <p className={styles.loadingText}>Cargando detalles...</p>;
  }

  if (error) {
    return <p className={styles.errorText}>Error: {error}</p>;
  }

  if (!movement) {
    return <p className={styles.errorText}>Movimiento no encontrado.</p>;
  }

  const columns = [
    { key: "barcode", label: "Código de Barras" },
    { key: "status", label: "Estado" },
  ];

  const data = movement.details.map((detail) => ({
    id: detail.id,
    barcode: detail.barcode,
    status: detail.status === "UNREGISTERED" ? "No registrado" : "Registrado",
  }));

  const mexicoTimeZone = "America/Mexico_City";
  const formattedDate = formatInTimeZone(
    movement.created_at,
    mexicoTimeZone,
    "dd/MM/yyyy HH:mm:ss",
    { locale: es }
  );

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div className={styles.nameContainer}>
          <NavIconButton icon={<BackIcon />} size="medium" to="/movements" />
          <h1 className={styles.titleText}>ID: {movement.id}</h1>
        </div>
      </div>

      <div className={styles.sidebarContainer}>
        <Card className={styles.sidebar}>
          <span className={styles.userTitle}>Información</span>
          <Card className={styles.miniCard}>
            <span className={styles.userSubTitle}>
              Usuario que hizo el movimiento
            </span>
            <span className={styles.userVar}>
              {movement.created_by?.name || "Desconocido"}
            </span>
          </Card>

          <Card className={styles.miniCard}>
            <span className={styles.userSubTitle}>TIPO DE MOVIMIENTO</span>
            <span className={styles.userVar}>
              {movement.type === "ENTRY"
                ? "ENTRADA"
                : "SALIDA" || "Desconocido"}
            </span>
          </Card>

          <Card className={styles.miniCard}>
            <span className={styles.userSubTitle}>FECHA DEL MOVIMIENTO</span>
            <span className={styles.userVar}>{formattedDate}</span>
          </Card>
        </Card>
      </div>

      <div className={styles.infoContainer}>
        <Card className={styles.productsContainer}>
          <span className={styles.tableTitle}>DETALLES DEL MOVIMIENTO</span>
          <Table columns={columns} data={data} renderActions={() => null} />
        </Card>
      </div>
    </div>
  );
};

export default MovementDetails;
