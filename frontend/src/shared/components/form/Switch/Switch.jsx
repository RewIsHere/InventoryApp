import React from "react";
import { motion } from "framer-motion";
import styles from "./Switch.module.css";

const Switch = ({ label, checked, onChange, disabled = false }) => {
  return (
    <motion.div
      className={`${styles.switchContainer} ${disabled ? styles.disabled : ""}`}
      onClick={() => !disabled && onChange(!checked)}
    >
      {/* Interruptor */}
      <motion.div
        className={`${styles.switchTrack} ${checked ? styles.checked : ""}`}
        initial={false}
        animate={{
          backgroundColor: checked ? "var(--color-primary)" : "var(--color-bg-secondary)",
        }}
        transition={{ duration: checked ? 0.2 : 0.1 }}
      >
        <motion.div
          className={styles.switchThumb}
          layout
          transition={{ type: "spring", stiffness: 700, damping: 30 }}
        />
      </motion.div>

      {/* Etiqueta */}
      {label && <label className={styles.label}>{label}</label>}
    </motion.div>
  );
};

export default Switch;
