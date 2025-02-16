// src/components/TimelineItem.jsx
import React from "react";
import styles from "./TimelineItem.module.css";

const TimelineItem = ({ date, details, author }) => {
  return (
    <div className={styles.timelineItem}>
      {/* Lado izquierdo: Círculo y línea vertical */}
      <div className={styles.timelineLeft}>
        <div className={styles.circleContainer}>
          <div className={styles.circle}></div>
        </div>

        <div className={styles.line}></div>
      </div>

      {/* Lado derecho: Contenido */}
      <div className={styles.timelineRight}>
        <div className={styles.dateOval}>{date}</div>
        <div className={styles.details}>{details}</div>
        <div className={styles.author}>{author}</div>
      </div>
    </div>
  );
};

export default TimelineItem;
