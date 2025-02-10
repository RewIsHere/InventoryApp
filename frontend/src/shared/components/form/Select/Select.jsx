import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Importar AnimatePresence
import { FaChevronDown, FaCheck } from "react-icons/fa"; // Usar el ícono de check también
import styles from "./Select.module.css";

const Select = ({ label, options, value, onChange, error, size = "medium" }) => {
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar si el select está abierto
  const selectRef = useRef(null); // Referencia para el contenedor del select

  useEffect(() => {
    // Detectar clic fuera del select para cerrarlo
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false); // Cerrar el menú si el clic es fuera del select
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectChange = (optionValue) => {
    onChange(optionValue); // Llamar a onChange pasando el valor de la opción
    setIsOpen(false); // Cerrar el menú después de seleccionar
  };

  return (
    <motion.div
      ref={selectRef} // Asignamos la referencia al contenedor del select
      className={`${styles.selectContainer} ${error ? styles.errorContainer : ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {label && <label className={styles.label}>{label}</label>}

      {/* Wrapper para el select */}
      <motion.div
        className={styles.selectWrapper}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Select con animación de apertura */}
        <motion.div
          className={`${styles.select} ${styles[size]} ${error ? styles.error : ""}`}
          whileFocus={{ borderColor: "var(--color-primary)" }}
          transition={{ duration: 0.2 }}
          onClick={() => setIsOpen((prev) => !prev)} // Cambiar el estado al hacer clic
        >
          {/* Mostrar la opción seleccionada o un mensaje por defecto */}
          {value ? options.find((option) => option.value === value)?.label : "Elige"}
        </motion.div>

        {/* Icono de flecha con animación de rotación */}
        <motion.div
          className={styles.arrowIcon}
          initial={{ rotate: 0 }}
          animate={{ rotate: isOpen ? 180 : 0 }} // Gira la flecha si el select está abierto
          transition={{ duration: 0.01 }}
        >
          <FaChevronDown /> {/* Icono de la flecha */}
        </motion.div>
      </motion.div>

      {/* Menú de opciones con animación de deslizamiento */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.optionsMenu}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {options.map((option) => (
              <motion.div
                key={option.value}
                className={`${styles.option} ${value === option.value ? styles.selectedOption : ""}`}
                onClick={() => handleSelectChange(option.value)} // Pasar el valor de la opción
                whileTap={{ scale: 0.98 }}
              >
                {option.label}

                {/* Mostrar el ícono de check si la opción está seleccionada */}
                {value === option.value && (
                  <FaCheck className={styles.checkIcon} />
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mensaje de error si existe */}
      {error && <p className={styles.errorMessage}>{error}</p>}
    </motion.div>
  );
};

export default Select;
