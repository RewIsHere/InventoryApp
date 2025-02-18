import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styles from "./Input.module.css";

const Input = ({
  label,
  type = "text",
  placeholder,
  name,
  onValueChange,
  size = "medium",
  externalError,
  value = "", // Cambié "defaultValue" a "value"
}) => {
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const newValue = e.target.value;
    let validationError = "";

    if (type === "email" && !/\S+@\S+\.\S+/.test(newValue)) {
      validationError = "Correo inválido";
    }

    setError(validationError);
    onValueChange?.(name, newValue, validationError);
  };

  return (
    <motion.div
      className={`${styles.inputContainer} ${
        error || externalError ? styles.errorContainer : ""
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {label && (
        <label className={styles.label} htmlFor={name}>
          {label}
        </label>
      )}
      <motion.input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value} // Cambié a "value" para ser controlado desde el exterior
        onChange={handleChange}
        className={`${styles.input} ${styles[size]} ${
          error || externalError ? styles.error : ""
        }`}
      />
      {(error || externalError) && (
        <p className={styles.errorMessage}>{error || externalError}</p>
      )}
    </motion.div>
  );
};

export default Input;
