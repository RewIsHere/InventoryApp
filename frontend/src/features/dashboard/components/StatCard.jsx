import React from "react";
import styles from "./StatCard.module.css";
import { Card } from "@Structure";

const StatCard = ({ icon, nombre, valor }) => {
  return (
    <Card className={styles.card}>
      <div className={styles.left}>
        <div className={styles.icon}>{icon}</div>
      </div>
      <div className={styles.right}>
        <span className={styles.stattitle}>{nombre}</span>
        <span className={styles.statnumber}>{valor}</span>
      </div>
    </Card>
  );
};

export default StatCard;
