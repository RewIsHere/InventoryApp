import React, { useState } from "react";
import styles from "./Table.module.css";

const Table = ({ columns, data, onSelectRows }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Manejar la selección/deselección de todas las filas
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
      setSelectAll(false);
      onSelectRows([]); // Notificar que no hay filas seleccionadas
    } else {
      const allRowIds = data.map((row) => row.id);
      setSelectedRows(allRowIds);
      setSelectAll(true);
      onSelectRows(allRowIds); // Notificar que todas las filas están seleccionadas
    }
  };

  // Manejar la selección/deselección de una fila individual
  const handleRowSelect = (id) => {
    if (selectedRows.includes(id)) {
      const updatedRows = selectedRows.filter((rowId) => rowId !== id);
      setSelectedRows(updatedRows);
      setSelectAll(false); // Desactivar "Seleccionar todo" si no están todas seleccionadas
      onSelectRows(updatedRows); // Notificar las filas seleccionadas
    } else {
      const updatedRows = [...selectedRows, id];
      setSelectedRows(updatedRows);
      if (updatedRows.length === data.length) setSelectAll(true); // Activar "Seleccionar todo" si están todas seleccionadas
      onSelectRows(updatedRows); // Notificar las filas seleccionadas
    }
  };

  return (
    <div className={styles.tableContainer}>
      {/* Encabezado */}
      <div className={styles.header}>
        <div className={styles.checkboxCell}>
          <ArrowCheckbox checked={selectAll} onClick={handleSelectAll} />
        </div>
        {columns.map((column, index) => (
          <div key={index} className={styles.columnHeader}>
            {column.label}
          </div>
        ))}
      </div>

      {/* Cuerpo */}
      <div className={styles.body}>
        {data.map((row) => (
          <div
            key={row.id}
            className={`${styles.row} ${selectedRows.includes(row.id) ? styles.selected : ""}`}
          >
            <div className={styles.checkboxCell}>
              <ArrowCheckbox
                checked={selectedRows.includes(row.id)}
                onClick={() => handleRowSelect(row.id)}
              />
            </div>
            {columns.map((column, index) => (
              <div key={index} className={styles.cell}>
                {row[column.key]}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente de flecha animada para seleccionar filas
const ArrowCheckbox = ({ checked, onClick }) => {
  return (
    <div
      className={`${styles.arrowCheckbox} ${checked ? styles.checked : ""}`}
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={styles.arrowIcon}
      >
        <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
      </svg>
    </div>
  );
};

export default Table;