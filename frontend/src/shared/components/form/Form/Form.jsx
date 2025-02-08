import React from "react";
import styles from "./Form.module.css";

const Form = ({ children, onSubmit, className = "" }) => {
  return (
    <form className={`${styles.form} ${className}`} onSubmit={onSubmit}>
      {children}
    </form>
  );
};

export default Form;