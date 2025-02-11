import React from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import styles from "./Tabs.module.css";

const Tabs = ({ tabs, activeTab, onTabChange }) => {
  const { id } = useParams(); // Obtener el ID del producto

  return (
    <div className={styles.tabsContainer}>
      {tabs.map((tab) => (
        <motion.div
          key={tab.key}
          className={`${styles.tab} ${activeTab === tab.key ? styles.active : ""}`}
          onClick={() => onTabChange(tab.key)} // Este onClick maneja el cambio de la pestaña
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          style={{ position: "relative" }} // Para la animación de la burbuja
        >
          {/* Hacemos que el Link ocupe todo el espacio del Tab, incluyendo el padding */}
          <Link to={`/products/${id}/details/${tab.key}`} style={{ display: "block", width: "100%", height: "100%", padding: "10px", textAlign: "center" }}>
            <motion.div

              whileTap={{ scale: 0.9 }}
              style={{ position: "relative", zIndex: 1 }} // Asegura que el texto esté por encima de la burbuja
            >
              {tab.label}
            </motion.div>
          </Link>

          {/* Animación de burbuja */}
          {activeTab === tab.key && (
            <motion.span
              layoutId="bubble" // El layoutId asegura que la animación se sincronice entre los tab botones
              className={styles.bubble}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 0, // Coloca la burbuja detrás del texto, sin interferir con el hover
                borderRadius: "9999px",
              }}
              transition={{
                type: "spring",
                bounce: 0.2,
                duration: 0.6,
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default Tabs;
