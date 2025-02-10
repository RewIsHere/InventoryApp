import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import styles from "./Skeleton.module.css";

const Skeleton = ({ children, isLoading, borderRadius = "4px", baseColor = "white", style = {} }) => {
  const childRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: "100%", height: "20px" });

  // Capturar tamaño del componente hijo
  useEffect(() => {
    if (childRef.current) {
      const { offsetWidth, offsetHeight } = childRef.current;
      setDimensions({ width: offsetWidth, height: offsetHeight });
    }
  }, []);

  return (
    <>
      {/* Elemento oculto para obtener dimensiones */}
      <div ref={childRef} style={{ visibility: "hidden", position: "absolute" }}>
        {children}
      </div>

      {isLoading ? (
        <motion.div
          className={styles.skeleton}
          style={{
            width: dimensions.width || "100%",
            height: dimensions.height || "20px",
            borderRadius: borderRadius,
            backgroundColor: baseColor,
            display: "block", // ⬅️ Importante para respetar la estructura de lista
            ...style, // Permitir estilos adicionales
          }}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 1.5,
            ease: "easeInOut",
          }}
        />
      ) : (
        children
      )}
    </>
  );
};

export default Skeleton;
