import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./IconButton.module.css";

const IconButton = ({
  icon,
  options = [], // Lista de opciones para el dropdown
  size = "medium",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null); // Referencia para el dropdown
  const buttonRef = useRef(null); // Referencia para el botón

  // Detectar clic fuera del dropdown o del botón para cerrarlo
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false); // Cerrar dropdown si el clic es fuera del contenedor o del botón
      }
    };
    document.addEventListener("mousedown", handleClickOutside); // Detectar clics fuera
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Limpiar el event listener
    };
  }, []);

  // Alternar el estado del dropdown al hacer clic en el botón
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  // Manejar la selección de una opción
  const handleOptionClick = (option) => {
    setIsOpen(false); // Cerrar el dropdown
    if (option.onClick) option.onClick(option); // Llamar al callback de la opción seleccionada
  };

  return (
    <div className={styles.container}>
      {/* Botón con ícono */}
      <motion.button
        ref={buttonRef} // Añadir referencia para el botón
        type="button"
        onClick={toggleDropdown} // Alternar el estado del dropdown
        disabled={disabled}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className={`${styles.iconButton} ${styles[size]} ${
          disabled ? styles.disabled : ""
        }`}
        aria-label="Icon button"
      >
        {icon}
      </motion.button>

      {/* Menú desplegable */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            className={styles.dropdownMenu}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Opciones del dropdown */}
            {options.map((option, index) => (
              <motion.div
                key={index}
                className={styles.option}
                onClick={() => handleOptionClick(option)}
                whileTap={{ scale: 0.98 }}
              >
                {/* Ícono */}
                <span className={styles.optionIcon}>{option.icon}</span>
                {/* Texto */}
                <span className={styles.optionText}>{option.text}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IconButton;
