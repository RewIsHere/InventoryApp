import React from "react";
import { motion } from "framer-motion"; // Asegúrate de importar motion
import styles from "./ImageBox.module.css";

const ImageBox = ({ src, alt, width = "30", height = "30", borderRadius = "10px" }) => {
  return (
    <motion.div
      className={styles.imageBox}
      style={{
        width: width,
        height: height,
        borderRadius: borderRadius,
      }}
      initial={{ opacity: 0, y: 20 }} // Animación inicial
      animate={{ opacity: 1, y: 0 }}   // Animación al estar visible
      transition={{ duration: 0.5, ease: "easeOut" }} // Duración y tipo de transición
    >
      <img src={src} alt={alt} className={styles.image} />
    </motion.div>
  );
};

export default ImageBox;
