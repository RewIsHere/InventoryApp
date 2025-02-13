import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import styles from "./Card.module.css";

/**
 * Componente de tarjeta con animaciones de Framer Motion.
 * Puede ser un enlace (`Link`) o un `div` dependiendo de la prop `isPressable`.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenido interno de la tarjeta.
 * @param {string} [props.className=""] - Clases adicionales para personalizar el estilo.
 * @param {boolean} [props.isPressable=false] - Si es `true`, la tarjeta se comporta como un enlace (`Link`).
 * @param {string} [props.to="#"] - URL a la que redirige si `isPressable` es `true`.
 */
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
    >
      {children}
    </Content>
  );
};

export default Card;
