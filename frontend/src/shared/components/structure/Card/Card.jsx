import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import styles from "./Card.module.css";

const Card = ({ children, className = "", isPressable = false, to = "#" }) => {
  // Si isPressable es true, usa motion(Link), sino usa motion.div
  const Content = isPressable ? motion(Link) : motion.div;

  return (
    <Content
      to={isPressable ? to : undefined} // Solo pasa 'to' si es un Link
      className={`${styles.card} ${className} ${
        isPressable ? styles.link : ""
      }`} // Agrega clase 'link' si es un Link
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </Content>
  );
};

export default Card;
