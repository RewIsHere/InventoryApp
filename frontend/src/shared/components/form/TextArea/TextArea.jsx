import React from "react";
import { motion } from "framer-motion";
import styles from "./Textarea.module.css";

const Textarea = ({ label, placeholder, value, onChange, error, size = "medium", maxLength = 200 }) => {
  // Variantes para la animación de opacidad
  const variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  };

  return (
    <motion.div
      className={`${styles.inputContainer} ${styles[size]} ${error ? styles.errorContainer : ""}`}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.3 }}
    >
      {label && <label className={styles.label}>{label}</label>}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        className={`${styles.textarea} ${styles[size]} ${error ? styles.error : ""}`} // Manejo directo de la clase de error
      />
      {error && <p className={styles.errorMessage}>{error}</p>}
    </motion.div>
  );
};

export default Textarea;
