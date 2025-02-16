import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import styles from "./TextWithIcon.module.css";

const TextWithIcon = ({ icon, text, onClick, className }) => {
  const containerRef = useRef(null); // Referencia al contenedor del componente
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (e) => {
    const offset = containerRef.current.getBoundingClientRect();
    const newX = e.clientX - offset.left;
    const newY = e.clientY - offset.top;
    const color = "rgba(255, 255, 255, 0.37)";

    let size = 0;
    let opacity = 0.25;

    const btnClick = () => {
      size += 8;
      opacity -= 0.008;

      containerRef.current.style.background = `${color} radial-gradient(circle at ${newX}px ${newY}px, rgba(1,8,22,${opacity}) ${size}%, transparent ${
        size + 2
      }%) no-repeat`;
      if (size <= 300) {
        requestAnimationFrame(btnClick);
      } else {
        containerRef.current.style.background = ""; // Reset background after animation
      }
    };

    btnClick();

    setIsClicked(true); // Marcar como clickeado
    if (onClick) onClick(e); // Llamar al callback si se proporciona
  };

  return (
    <motion.div
      className={styles.container}
      onClick={handleClick}
      ref={containerRef}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {/* Ícono */}
      <span className={`${styles.icon} ${className}`}>{icon}</span>
      {/* Texto */}
      <span className={styles.text}>{text}</span>
    </motion.div>
  );
};

export default TextWithIcon;
