import React from "react";
import styles from "./Divider.module.css";

const Divider = ({ orientation = "horizontal", size = "1px", color = "var(--color-border)" }) => {
  const className = orientation === "vertical" ? styles.vertical : styles.horizontal;

  return (
    <div
      className={`${className}`}
      style={{
        backgroundColor: color,
        width: orientation === "vertical" ? size : "100%",
        height: orientation === "horizontal" ? size : "100%",
      }}
    ></div>
  );
};

export default Divider;