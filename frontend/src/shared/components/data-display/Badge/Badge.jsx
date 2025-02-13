import React from "react";
import styles from "./Badge.module.css";

const Badge = ({
  text,
  color = "var(--color-primary)",
  backgroundColor = "var(--color-bg-secondary)",
  variant = "filled", // "filled" o "outline",
  radius = "12px",
  className = "",
}) => {
  const badgeStyle =
    variant === "outline"
      ? {
          color: color,
          backgroundColor: "transparent", // Fondo transparente para outline
          border: `2px solid ${color}`, // Borde del color del texto
          borderRadius: radius,
        }
      : {
          color: color,
          backgroundColor: backgroundColor,
          borderRadius: radius,
        };

  return (
    <div className={`${styles.badge} ${className}`} style={badgeStyle}>
      {text}
    </div>
  );
};

export default Badge;
