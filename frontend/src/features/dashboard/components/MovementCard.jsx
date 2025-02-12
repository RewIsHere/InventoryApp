import React from "react";
import styles from "./MovementCard.module.css";
import { Card } from "@Structure";
import { Badge } from "@DataDisplay";
import { Link } from "react-router-dom";

const MovementCard = ({ uuid, productos, usuario, tipo }) => {
  return (
    <Card className={styles.card}>
      <div className={styles.id}>
        <span>{uuid}</span>
      </div>
      <div className={styles.products}>
        <span>{productos} productos escaneados</span>
      </div>
      <div className={styles.user}>
        <p>Hecho por</p>
        <span className={styles.username}>{usuario}</span>
      </div>
      <div className={styles.type}>
        <Badge
          text={tipo}
          color="white"
          backgroundColor={tipo === "Entrada" ? "#006fee" : "#ff3b30"}
        />
      </div>
      <div className={styles.button}>
        <Link to={`/movements/${uuid}/details`} className={styles.view}>
          Ver
        </Link>
      </div>
    </Card>
  );
};

export default MovementCard;
