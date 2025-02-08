import React from "react";
import { motion } from "framer-motion";
import styles from "./Select.module.css";

const Select = ({ label, options, value, onChange, error, size = "medium" }) => {
  return (
    <motion.div
      className={`${styles.selectContainer} ${error ? styles.errorContainer : ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {label && <label className={styles.label}>{label}</label>}
      <motion.select
        value={value}
        onChange={onChange}
        className={`${styles.select} ${styles[size]} ${error ? styles.error : ""}`}
        whileFocus={{ borderColor: "var(--color-primary)" }}
        transition={{ duration: 0.2 }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </motion.select>
      <motion.div
        className={styles.arrowIcon}
        initial={{ rotate: 0 }}
        animate={{ rotate: 180 }}
        transition={{ duration: 0.2 }}
      >
        ▼
      </motion.div>
      {error && <p className={styles.errorMessage}>{error}</p>}
    </motion.div>
  );
};

export default Select;