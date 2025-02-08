import React from "react";
import { motion } from "framer-motion";
import styles from "./Checkbox.module.css";

const Checkbox = ({ label, checked, onChange, disabled = false }) => {
  return (
    <motion.div
      className={`${styles.checkboxContainer} ${disabled ? styles.disabled : ""}`}
      onClick={() => !disabled && onChange(!checked)}
    >
      {/* Casilla de verificación */}
      <motion.div
        className={`${styles.checkbox} ${checked ? styles.checked : ""}`}
        initial={false}
        animate={{
          borderColor: checked ? "var(--color-primary)" : "#CCC",
          backgroundColor: checked ? "var(--color-primary)" : "transparent",
        }}
        transition={{ duration: 0.2 }}
      >
        {checked && (
          <motion.svg
            className={styles.checkmark}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <motion.path
              fill="none"
              stroke="#fff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 12l5 5l10 -10"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </motion.svg>
        )}
      </motion.div>

      {/* Etiqueta */}
      {label && <label className={styles.label}>{label}</label>}
    </motion.div>
  );
};

export default Checkbox;
