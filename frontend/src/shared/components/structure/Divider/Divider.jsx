import React from "react";
import styles from "./Divider.module.css";

const Divider = ({ orientation = "horizontal", size = "1px", color = "var(--color-border)", height = "100px" }) => {
  const className = orientation === "vertical" ? styles.vertical : styles.horizontal;

  return (
    <div
      className={`${className}`}
      style={{
        backgroundColor: color,
        width: orientation === "vertical" ? size : "100%",
        height: orientation === "horizontal" ? size : height, // Para el divider vertical, aseguramos una altura mínima
      }}
    ></div>
  );
};

export default Divider;
