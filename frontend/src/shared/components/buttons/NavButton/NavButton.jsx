import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // Importamos Link de React Router DOM
import styles from "./NavButton.module.css";

const NavButton = ({ children, to = "/", target = "_self", size = "medium", variant = "outline", icon = null, isActive = false }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {/* Usamos Link para la navegación interna */}
      <Link
        to={to}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        className={`${styles.linkButton} ${styles[size]} ${isActive ? styles.solid : styles[variant]}`}
      >
        {icon && <span className={styles.icon}>{icon}</span>}
        <span>{children}</span>
      </Link>
    </motion.div>
  );
};

export default NavButton;