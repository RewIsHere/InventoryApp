import React from "react";
import { motion } from "framer-motion";
import styles from "./Textarea.module.css";

const Textarea = ({ label, placeholder, value, onChange, error, size = "medium" }) => {
  // Definir variantes para las animaciones
  const variants = {
    initial: { borderColor: "transparent" },
    focus: { borderColor: "var(--color-primary)" },
    error: { borderColor: "var(--color-danger)" },
  };

  return (
    <motion.div
      className={`${styles.inputContainer} ${error ? styles.errorContainer : ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Etiqueta */}
      {label && <label className={styles.label}>{label}</label>}
      {/* Campo de texto animado */}
      <motion.textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`${styles.textarea} ${styles[size]} ${error ? styles.error : ""}`}
        variants={variants}
        initial="initial"
        whileFocus="focus"
        animate={error ? "error" : "initial"}
        transition={{ duration: 0.2 }}
      />
      {/* Mensaje de error */}
      {error && <p className={styles.errorMessage}>{error}</p>}
    </motion.div>
  );
};

export default Textarea;