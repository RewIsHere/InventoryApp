import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./DropdownIconButton.module.css";

const DropdownIconButton = ({ icon, options, onOptionClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Manejar la selección de una opción
  const handleOptionClick = (option) => {
    setIsOpen(false); // Cerrar el menú
    if (onOptionClick) onOptionClick(option); // Llamar al callback con la opción seleccionada
  };

  return (
    <div className={styles.container}>
      {/* Botón principal */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)} // Alternar el estado del menú
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className={`${styles.iconButton} ${isOpen ? styles.active : ""}`}
        aria-label="Dropdown button"
      >
        {icon}
      </motion.button>

      {/* Menú desplegable */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.dropdownMenu}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {options.map((option, index) => (
              <motion.div
                key={index}
                className={styles.option}
                onClick={() => handleOptionClick(option)}
                whileHover={{ backgroundColor: "var(--color-bg-hover)" }}
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

export default DropdownIconButton;