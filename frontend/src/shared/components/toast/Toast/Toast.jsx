import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Toast.module.css";

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // Cierra el toast después de 3 segundos
    return () => clearTimeout(timer);
  }, [onClose]);

  return ReactDOM.createPortal(
    <AnimatePresence>
      <motion.div
        className={`${styles.toast} ${styles[type]}`}
        initial={{ opacity: 0, y: -50 }} // Inicia fuera de la pantalla
        animate={{ opacity: 1, y: 0 }} // Aparece en la posición correcta
        exit={{ opacity: 0, y: -50 }} // Sale hacia arriba
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {message}
      </motion.div>
    </AnimatePresence>,
    document.getElementById("toast-root") // Renderizado fuera del árbol principal
  );
};

export default Toast;