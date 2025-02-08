import React, { useState } from "react";
import { motion } from "framer-motion";
import styles from "./NumberInput.module.css";

const NumberInput = ({ label, value: initialValue = 0, min = 0, max = 100, step = 1, onChange }) => {
  const [value, setValue] = useState(initialValue);

  // Función para manejar el cambio de valor
  const handleChange = (newValue) => {
    const clampedValue = Math.min(max, Math.max(min, newValue));
    setValue(clampedValue);
    if (onChange) onChange(clampedValue); // Notificar al padre si hay un cambio
  };

  // Incrementar el valor
  const increment = () => {
    handleChange(value + step);
  };

  // Decrementar el valor
  const decrement = () => {
    handleChange(value - step);
  };

  return (
    <motion.div className={styles.container}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.inputWrapper}>
        {/* Botón de decremento */}
        <motion.button
          className={`${styles.button} ${styles.decrement}`}
          onClick={decrement}
          whileTap={{ scale: 0.95 }}
          disabled={value <= min}
        >
          -
        </motion.button>

        {/* Campo de número */}
        <motion.input
          type="number"
          value={value}
          onChange={(e) => handleChange(Number(e.target.value))}
          className={styles.numberInput}
          readOnly
        />

        {/* Botón de incremento */}
        <motion.button
          className={`${styles.button} ${styles.increment}`}
          onClick={increment}
          whileTap={{ scale: 0.95 }}
          disabled={value >= max}
        >
          +
        </motion.button>
      </div>
    </motion.div>
  );
};

export default NumberInput;