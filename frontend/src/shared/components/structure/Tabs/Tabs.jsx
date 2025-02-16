import React from "react";
import { motion } from "framer-motion";
import { Link, useParams, useLocation } from "react-router-dom";
import styles from "./Tabs.module.css";

const Tabs = ({ tabs }) => {
  const { id } = useParams();
  const location = useLocation();
  const activeTab = location.pathname.split("/").pop(); // Detecta la pestaña activa

  return (
    <div className={styles.tabsContainer}>
      {tabs.map((tab) => (
        <motion.div
          key={tab.key}
          className={`${styles.tab} ${
            activeTab === tab.key ? styles.active : ""
          }`}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          style={{ position: "relative" }}
        >
          {/* Link que ocupa todo el espacio del Tab */}
          <Link
            to={`/products/${id}/${tab.key}`}
            style={{
              display: "flex",
              width: "100%",
              height: "100%",
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <motion.div
              whileTap={{ scale: 0.9 }}
              style={{ position: "relative", zIndex: 1 }}
            >
              {tab.label}
            </motion.div>
          </Link>

          {/* Animación de burbuja para el tab activo */}
          {activeTab === tab.key && (
            <motion.span
              layoutId="bubble"
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
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default Tabs;
