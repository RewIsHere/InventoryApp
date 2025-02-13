import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./ButtonGroup.module.css";

const ButtonGroup = ({ options, onSelect, selected }) => {
  const [activeOption, setActiveOption] = useState(selected);

  // Manejar la selección de un botón
  const handleButtonClick = (option) => {
    setActiveOption(option);
    if (onSelect) onSelect(option); // Llamar al callback si se proporciona
  };

  // Asegurar que el componente se actualice cuando la prop `selected` cambie
  useEffect(() => {
    setActiveOption(selected);
  }, [selected]);

  return (
    <div className={styles.container}>
      {options.map((option, index) => (
        <motion.button
          key={index}
          className={`${styles.button} ${
            activeOption === option ? styles.active : ""
          }`}
          onClick={() => handleButtonClick(option)}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {option}
        </motion.button>
      ))}
    </div>
  );
};

export default ButtonGroup;
