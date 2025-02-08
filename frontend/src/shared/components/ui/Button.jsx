import React from "react";
import { motion } from "framer-motion";
import styles from "./Button.module.css";

const Button = ({ children, onClick, type = "button", variant = "primary", size = "medium", disabled = false }) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${variant === "outline" ? styles.outline : ""}`}
    >
      {children}
    </motion.button>
  );
};

export default Button;