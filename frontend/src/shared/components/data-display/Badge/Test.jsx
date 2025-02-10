import React from "react";
import Badge from "./shared/components/data-display/Badge"; // Asegúrate de que Badge esté correctamente importado
import styles from "./Test.module.css"; // Puedes crear estilos adicionales si lo necesitas

const Test = () => {
  return (
    <div className={styles.testContainer}>
      <h2>Pruebas de Badge</h2>
      
      <div className={styles.badgeContainer}>
        {/* Ejemplos de Badge con fondo (filled) */}
        <Badge text="Activo" color="white" backgroundColor="green" />
        <Badge text="Inactivo" color="white" backgroundColor="gray" />
        <Badge text="Pendiente" color="white" backgroundColor="yellow" />
        <Badge text="Completado" color="white" backgroundColor="blue" />
        <Badge text="Urgente" color="white" backgroundColor="red" />
        <Badge text="En Progreso" color="black" backgroundColor="orange" />

        {/* Ejemplos de Badge con variante outline */}
        <Badge text="Activo" color="green" variant="outline" />
        <Badge text="Inactivo" color="gray" variant="outline" />
        <Badge text="Pendiente" color="yellow" variant="outline" />
        <Badge text="Completado" color="blue" variant="outline" />
        <Badge text="Urgente" color="red" variant="outline" />
        <Badge text="En Progreso" color="orange" variant="outline" />
      </div>
    </div>
  );
};

export default Test;
