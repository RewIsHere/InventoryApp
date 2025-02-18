import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./PendingPage.module.css";
import PendingList from "../components/PendingList";
import Searchbar from "../components/Searchbar";

const PendingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleSearch = (query) => {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      if (query) {
        newParams.set("search", query);
      } else {
        newParams.delete("search");
      }
      return newParams;
    });
  };

  return (
    <div className={styles.MainContainer}>
      <div className={styles.PageHeader}>
        <div className={styles.PageTitle}>
          <h1 className={styles.titleText}>Productos Pendientes</h1>
        </div>
        <div className={styles.rightHeader}>
          <Searchbar
            placeholder="Buscar por codigo de barras..."
            onSearch={handleSearch}
          />
        </div>
      </div>
      <div className={styles.BodyContainer}>
        <div className={styles.left}></div>
        <div className={styles.right}>
          <PendingList />
        </div>
      </div>
    </div>
  );
};

export default PendingPage;
