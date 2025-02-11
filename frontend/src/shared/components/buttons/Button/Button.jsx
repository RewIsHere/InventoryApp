import React, { useRef } from "react";
import { motion } from "framer-motion";
import styles from "./Button.module.css";

const Button = ({ children, onClick, type = "button", variant = "primary", size = "medium", disabled = false }) => {
  const buttonRef = useRef(null);

  const handleClick = (e) => {
    const offset = buttonRef.current.getBoundingClientRect();
    const newX = e.clientX - offset.left;
    const newY = e.clientY - offset.top;
    const color = getComputedStyle(buttonRef.current).backgroundColor;
    
    let size = 0;
    let opacity = 0.25;

    const btnClick = () => {
      size += 8;
      opacity -= 0.008;

      buttonRef.current.style.background = `${color} radial-gradient(circle at ${newX}px ${newY}px, rgba(1,8,22,${opacity}) ${size}%, transparent ${size + 2}%) no-repeat`;
      if (size <= 300) {
        requestAnimationFrame(btnClick);
      } else {
        buttonRef.current.style.background = ''; // Reset background after animation
      }
    };

    btnClick();
    
    // Trigger the onClick callback if provided
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <motion.button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`${styles.button} ${styles[variant]} ${styles[size]}`}
      ref={buttonRef}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.button>
  );
};

export default Button;
