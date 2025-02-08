import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // Importamos Link de React Router DOM
import styles from "./NavIconButton.module.css";

const NavIconButton = ({ to = "/", target = "_self", icon, size = "medium", disabled = false }) => {
  return (
    <motion.div
      whileHover={!disabled && { scale: 1.1 }}
      whileTap={!disabled && { scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {/* Usamos Link para la navegación interna */}
      <Link
        to={disabled ? undefined : to}
        target={target === "_blank" ? "_blank" : undefined}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        className={`${styles.iconButton} ${styles[size]} ${disabled ? styles.disabled : ""}`}
        aria-disabled={disabled}
      >
        {icon}
      </Link>
    </motion.div>
  );
};

export default NavIconButton;