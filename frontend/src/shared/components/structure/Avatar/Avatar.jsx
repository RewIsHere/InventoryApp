import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Avatar.module.css"; // Asegúrate de que este archivo exista

const Avatar = ({
  name,
  email, // Nuevo prop para el correo electrónico
  size = "40px",
  backgroundColor = "var(--color-primary)",
  textColor = "var(--color-text)",
  options,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null); // Referencia para el dropdown
  const avatarRef = useRef(null); // Referencia para el avatar

  // Extraer las iniciales del nombre
  const getInitials = (fullName) => {
    if (!fullName) return "";
    const names = fullName.split(" ");
    if (names.length === 1) return names[0][0].toUpperCase();
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  };

  const initials = getInitials(name);

  // Manejar la selección de una opción
  const handleOptionClick = (option) => {
    setIsOpen(false); // Cerrar el dropdown
    if (option.onClick) option.onClick(option); // Llamar al callback de la opción seleccionada
  };

  // Detectar clic fuera del dropdown o el avatar para cerrarlo
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target)
      ) {
        setIsOpen(false); // Cerrar dropdown si el clic es fuera del contenedor o el avatar
      }
    };
    document.addEventListener("mousedown", handleClickOutside); // Detectar clics fuera
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Limpiar el event listener
    };
  }, []);

  // Alternar el estado del dropdown al hacer clic en el avatar
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.container}>
      {/* Avatar */}
      <motion.div
        ref={avatarRef} // Añadir referencia para el avatar
        className={styles.avatar}
        style={{
          width: size,
          height: size,
          backgroundColor: backgroundColor,
          color: textColor,
        }}
        onClick={toggleDropdown} // Alternar el estado del dropdown
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {initials}
      </motion.div>
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
            {/* Encabezado del dropdown */}
            <div className={styles.dropdownHeader}>
              <span className={styles.dropdownHeaderText}>{name}</span>
              <span className={styles.dropdownHeaderSubtext}>{email}</span>
            </div>
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

export default Avatar;