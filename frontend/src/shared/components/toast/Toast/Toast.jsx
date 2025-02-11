import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Toast.module.css";

const Toast = ({ notification, onRemove, index }) => {
  const getBackgroundColor = (type) => {
    switch (type) {
      case "success":
        return "#4caf50"; // Verde
      case "error":
        return "#f44336"; // Rojo
      case "warning":
        return "#ff9800"; // Naranja
      case "info":
        return "#2196f3"; // Azul
      default:
        return "#4caf50"; // Por defecto: verde
    }
  };

  return (
    <motion.div
      layout // Habilita animaciones automáticas de posición
      initial={{ opacity: 0, y: -50, scale: 0.8 }} // Inicia fuera de la pantalla
      animate={{ opacity: 1, y: 0, scale: 1 }} // Animación de entrada
      exit={{ opacity: 0, y: -50, scale: 0.8 }} // Animación de salida
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      className={styles.toastContainer}
      style={{
        backgroundColor: getBackgroundColor(notification.type),
      }}
    >
      <p className={styles.toastMessage}>{notification.message}</p>
      <button className={styles.toastCloseButton} onClick={onRemove}>
        ✖️
      </button>
    </motion.div>
  );
};

export default Toast;