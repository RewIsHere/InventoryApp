import React from "react";
import { motion } from "framer-motion";
import styles from "./Input.module.css";

const Input = ({ label, type = "text", placeholder, value, onChange, error, size = "medium" }) => {
  return (
    <motion.div
      className={`${styles.inputContainer} ${error ? styles.errorContainer : ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {label && <label className={styles.label}>{label}</label>}
      <motion.input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`${styles.input} ${styles[size]} ${error ? styles.error : ""}`}
        whileFocus={{ borderColor: "var(--color-primary)" }}
        transition={{ duration: 0.2 }}
      />
      {error && <p className={styles.errorMessage}>{error}</p>}
    </motion.div>
  );
};

export default Input;