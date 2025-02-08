import React from "react";
import { motion } from "framer-motion";
import styles from "./IconButton.module.css";

const IconButton = ({ icon, onClick, type = "button", size = "medium", disabled = false }) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`${styles.iconButton} ${styles[size]} ${disabled ? styles.disabled : ""}`}
      aria-label="Icon button"
    >
      {icon}
    </motion.button>
  );
};

export default IconButton;