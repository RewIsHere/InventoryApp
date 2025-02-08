import React from "react";
import { motion } from "framer-motion";
import styles from "./Tabs.module.css";

const Tabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className={styles.tabsContainer}>
      {tabs.map((tab) => (
        <motion.div
          key={tab.key}
          className={`${styles.tab} ${activeTab === tab.key ? styles.active : ""}`}
          onClick={() => onTabChange(tab.key)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {tab.label}
        </motion.div>
      ))}
    </div>
  );
};

export default Tabs;