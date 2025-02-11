import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./Table.module.css";

const Table = ({ columns, data, allData, onSelectRows }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    // Si todas las filas de allData están seleccionadas, activar "Seleccionar todo"
    if (selectedRows.length === allData.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedRows, allData]);

  // Manejar la selección/deselección de todas las filas
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
      onSelectRows([]); // Notificar que no hay filas seleccionadas
    } else {
      const allRowIds = allData.map((row) => row.id); // Seleccionar todas las filas
      setSelectedRows(allRowIds);
      onSelectRows(allRowIds); // Notificar que todas las filas están seleccionadas
    }
  };

  // Manejar la selección/deselección de una fila individual
  const handleRowSelect = (id) => {
    const updatedRows = selectedRows.includes(id)
      ? selectedRows.filter((rowId) => rowId !== id)
      : [...selectedRows, id];

    setSelectedRows(updatedRows);
    onSelectRows(updatedRows); // Notificar las filas seleccionadas
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

const ArrowCheckbox = ({ checked, onClick }) => {
  return (
    <div
      className={`${styles.arrowCheckbox} ${checked ? styles.checked : ""}`}
      onClick={onClick}
    >
      <motion.div
        className={styles.checkbox}
        initial={false}
        animate={{
          borderColor: checked ? "var(--color-primary)" : "#CCC",
          backgroundColor: checked ? "var(--color-primary)" : "gray",
        }}
        transition={{ duration: 0.12 }}
      >
        <motion.svg
          className={styles.arrowIcon}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          initial={{ opacity: 0 }}
          animate={{ opacity: checked ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.path
            fill="none"
            stroke="#fff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 12l5 5l10 -10"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: checked ? 1 : 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </motion.svg>
      </motion.div>
    </div>
  );
};

export default Table;
