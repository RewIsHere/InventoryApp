import React, { useState } from "react";
import { motion } from "framer-motion";
import styles from "./ButtonGroup.module.css";

const ButtonGroup = ({ options, onSelect }) => {
  const [activeOption, setActiveOption] = useState(null);

  // Manejar la selección de un botón
  const handleButtonClick = (option) => {
    setActiveOption(option);
    if (onSelect) onSelect(option); // Llamar al callback si se proporciona
  };

  return (
    <div className={styles.container}>
      {options.map((option, index) => (
        <motion.button
          key={index}
          className={`${styles.button} ${activeOption === option ? styles.active : ""}`}
          onClick={() => handleButtonClick(option)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {option}
        </motion.button>
      ))}
    </div>
  );
};

export default ButtonGroup;