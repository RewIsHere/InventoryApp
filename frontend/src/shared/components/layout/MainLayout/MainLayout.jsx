import React from "react";
import Header from "../Header";
import styles from "./MainLayout.module.css";

const MainLayout = ({ children }) => {
  return (
    <div className={styles.layout}>
      {/* Header */}
      <Header />

      {/* Contenido Principal */}
      <main className={styles.content}>{children}</main>
    </div>
  );
};

export default MainLayout;