import React from "react";
import styles from "./Form.module.css";

const Form = ({ children, onSubmit, className = "" }) => {
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario
    onSubmit?.(e); // Llamar a la función onSubmit pasada como prop
  };

  return (
    <form onSubmit={handleSubmit} className={`${styles.form} ${className}`}>
      {children}
    </form>
  );
};

export default Form;