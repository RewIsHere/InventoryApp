import React from "react";
import { motion } from "framer-motion";
import styles from "./Table.module.css";

const Table = ({ columns, data, renderActions }) => {
  return (
    <div className={styles.tableContainer}>
      {/* Encabezado */}
      <div className={styles.header}>
        {columns.map((column, index) => (
          <div key={index} className={styles.columnHeader}>
            {column.label}
          </div>
        ))}
      </div>

      {/* Cuerpo */}
      <div className={styles.body}>
        {data.map((row) => (
          <div key={row.id} className={styles.row}>
            {columns.map((column, index) => (
              <div key={index} className={styles.cell}>
                {/* Mostrar las acciones solo si la columna es "actions" */}
                {column.key === "actions"
                  ? renderActions(row) // Renderizar acciones aquí
                  : row[column.key]}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Table;
