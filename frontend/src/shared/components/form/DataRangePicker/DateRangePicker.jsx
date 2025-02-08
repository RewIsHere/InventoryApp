import React, { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./DateRangePicker.module.css";
import { motion } from "framer-motion";

// Importar idioma (opcional, si necesitas soporte multilenguaje)
import es from "date-fns/locale/es";
registerLocale("es", es);

const DateRangePicker = ({ label, onChange, locale = "es" }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // Manejar la selección del rango de fechas
  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    setIsOpen(false); // Cerrar el calendario después de seleccionar
    if (onChange) onChange({ startDate: start, endDate: end });
  };

  return (
    <div className={styles.container}>
      {/* Etiqueta */}
      {label && <label className={styles.label}>{label}</label>}

      {/* Campo de entrada */}
      <motion.div
        className={styles.inputWrapper}
        onClick={() => setIsOpen(true)}
        whileTap={{ scale: 0.98 }}
      >
        <input
          type="text"
          readOnly
          placeholder="Selecciona un rango de fechas"
          value={
            startDate && endDate
              ? `${formatDate(startDate)} - ${formatDate(endDate)}`
              : ""
          }
          className={styles.input}
        />
        <span className={styles.calendarIcon}>📅</span>
      </motion.div>

      {/* Calendario */}
      {isOpen && (
        <motion.div
          className={styles.calendarContainer}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <DatePicker
            selected={startDate}
            onChange={handleDateChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            inline
            locale={locale}
            withPortal
            calendarClassName={styles.calendar}
          />
        </motion.div>
      )}
    </div>
  );
};

// Función auxiliar para formatear la fecha
const formatDate = (date) => {
  if (!date) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default DateRangePicker;