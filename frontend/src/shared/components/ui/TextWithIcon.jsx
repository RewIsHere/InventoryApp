import React from "react";
import { motion } from "framer-motion";
import styles from "./TextWithIcon.module.css";

const TextWithIcon = ({ icon, text, onClick }) => {
  return (
    <motion.div
      className={styles.container}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {/* Ícono */}
      <span className={styles.icon}>{icon}</span>
      {/* Texto */}
      <span className={styles.text}>{text}</span>
    </motion.div>
  );
};

export default TextWithIcon;