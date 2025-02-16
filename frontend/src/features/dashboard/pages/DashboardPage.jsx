import React from "react";
import styles from "./DashboardPage.module.css";
import LowStock from "../components/LowStock";
import Stats from "../components/Stats";
import LatestMovements from "../components/LatestMovements";

const DashboardPage = () => {
  return (
    <div className={styles.MainContainer}>
      <div className={styles.PageHeader}>
        <h1 className={styles.PageTitle}>Inicio</h1>
      </div>
      <div className={styles.BodyContainer}>
        <Stats />
        <LowStock />
        <LatestMovements />
      </div>
    </div>
  );
};

export default DashboardPage;
