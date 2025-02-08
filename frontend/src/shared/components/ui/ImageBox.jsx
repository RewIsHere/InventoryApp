import React from "react";
import styles from "./ImageBox.module.css";

const ImageBox = ({ src, alt, size = "medium", borderRadius = "10px" }) => {
  return (
    <div
      className={styles.imageBox}
      style={{
        width: size,
        height: size,
        borderRadius: borderRadius,
      }}
    >
      <img src={src} alt={alt} className={styles.image} />
    </div>
  );
};

export default ImageBox;