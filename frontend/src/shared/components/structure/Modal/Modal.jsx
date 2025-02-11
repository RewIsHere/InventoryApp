import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose } from "react-icons/md"; // Importa el ícono de "X" de react-icons
import styles from "./Modal.module.css";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={styles.modal}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
          initial={{ y: -50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -50, opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.12 }}
        >
          {/* Botón para cerrar el modal usando react-icons */}
          <button 
            className={styles.closeButton} 
            onClick={onClose} 
            aria-label="Cerrar"
          >
            <MdClose size={30} /> {/* Ícono de cierre */}
          </button>

          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Modal;
