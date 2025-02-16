import React from "react";
import styles from "./NoteCard.module.css";
import { Card, Divider } from "@/shared/components/structure";

const NoteCard = ({ author, date, content }) => {
  return (
    <Card className={styles.card}>
      <div className={styles.noteHeader}>
        <span className={styles.author}>{author}</span>
        <span className={styles.date}>{date}</span>
      </div>
      <Divider
        color="var(--color-text-secondary-opacity)"
        orientation="horizontal"
      />
      <div className={styles.noteContent}>
        <span className={styles.content}>{content}</span>
      </div>
    </Card>
  );
};

export default NoteCard;
