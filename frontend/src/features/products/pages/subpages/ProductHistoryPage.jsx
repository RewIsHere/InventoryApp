import React from "react";
import styles from "./ProductHistoryPage.module.css";
import TimelineItem from "../../components/TimelineItem";
import { Card } from "@/shared/components/structure";
import { formatInTimeZone } from "date-fns-tz"; // Para manejar zonas horarias
import { format } from "date-fns"; // Para formatear fechas
import { es } from "date-fns/locale"; // Español
import { useProductHistory } from "../../hooks/useProductHistory"; // Asegúrate de que la ruta sea correcta

const ProductHistoryPage = () => {
  const { timelineData, loading, error } = useProductHistory();

  // Zona horaria de Mexico City
  const timeZone = "America/Mexico_City";

  if (loading) {
    return <p>Cargando historial...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Convertir las fechas al formato deseado y zona horaria
  const formattedData = timelineData.map((item) => {
    const zonedDate = formatInTimeZone(
      item.date,
      timeZone,
      "yyyy-MM-dd HH:mm:ss"
    );
    const formattedDate = format(
      new Date(zonedDate),
      "EEEE, dd 'de' MMMM 'de' yyyy HH:mm",
      {
        locale: es,
      }
    );

    return {
      ...item,
      date: formattedDate,
    };
  });

  return (
    <Card className={styles.card}>
      <div className={styles.timelineList}>
        {formattedData.map((item) => (
          <TimelineItem
            key={item.id}
            date={item.date}
            details={item.details}
            author={item.user}
          />
        ))}
      </div>
    </Card>
  );
};

export default ProductHistoryPage;
