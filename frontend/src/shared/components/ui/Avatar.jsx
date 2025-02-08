import React from "react";
import styles from "./Avatar.module.css";

const Avatar = ({ name, size = "40px", backgroundColor = "var(--color-primary)", textColor = "var(--color-text)" }) => {
  // Extraer las iniciales del nombre y apellido
  const getInitials = (fullName) => {
    if (!fullName) return "";
    const names = fullName.split(" ");
    if (names.length === 1) return names[0][0].toUpperCase();
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  };

  const initials = getInitials(name);

  return (
    <div
      className={styles.avatar}
      style={{
        width: size,
        height: size,
        backgroundColor: backgroundColor,
        color: textColor,
      }}
    >
      {initials}
    </div>
  );
};

export default Avatar;