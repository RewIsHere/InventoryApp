import React from "react";
import styles from "./Badge.module.css";

const Badge = ({ text, color = "var(--color-primary)", backgroundColor = "var(--color-bg-secondary)" }) => {
  return (
    <div
      className={styles.badge}
      style={{
        color: color,
        backgroundColor: backgroundColor,
      }}
    >
      {text}
    </div>
  );
};

export default Badge;