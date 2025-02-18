import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./PendingCard.module.css";
import { Card, ImageBox, Divider, Modal } from "@Structure";
import { Badge } from "@DataDisplay";
import { IconButton } from "@Buttons";
import DotsIcon from "@Assets/Dots.svg?react";
import ViewIcon from "@Assets/Redirect.svg?react";

const PendingCard = ({ id, type, barcode, user }) => {
  const options = [
    {
      icon: <ViewIcon />,
      text: (
        <Link to={`/pendings/${id}/`} className={styles.link}>
          Detalles
        </Link>
      ),
    },
  ];

  return (
    <>
      <Card className={styles.card}>
        <div className={styles.name}>
          <span className={styles.movementID}>{id}</span>
        </div>
        <div className={styles.statusCategory}>
          <Badge
            text={type}
            color="white"
            backgroundColor={type === "ENTRADA" ? "#006fee" : "#ff4d4d"}
            className={styles.badge}
          />
        </div>
        <div className={styles.divider}>
          <Divider
            orientation="vertical"
            size="1px"
            color="var(--color-text-secondary-opacity)"
            height="60%"
          />
        </div>
        <div className={styles.barcodeTitle}>
          <span className={styles.titleText}>CODIGO DE BARRAS</span>
        </div>
        <div className={styles.userTitle}>
          <span className={styles.titleText}>HECHO POR</span>
        </div>
        <div className={styles.barcode}>
          <span className={styles.value}>{barcode}</span>
        </div>
        <div className={styles.user}>
          <span className={styles.value}>{user}</span>
        </div>
        <div className={styles.action}>
          <IconButton icon={<DotsIcon />} options={options} size="medium" />
        </div>
      </Card>
    </>
  );
};

export default PendingCard;
