import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./MovementsPage.module.css";
import Sidebar from "../components/Sidebar";
import ProductList from "../components/ProductList";
import Searchbar from "../components/Searchbar";
import { Button } from "@Buttons";

const MovementsPage = () => {
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

  const handleNavigation = () => {
    navigate("/products/add"); // Cambia "/otra-ruta" por la URL deseada
  };

  return (
    <div className={styles.MainContainer}>
      <div className={styles.PageHeader}>
        <div className={styles.PageTitle}>
          <h1 className={styles.titleText}>Movimientos</h1>
        </div>
        <div className={styles.rightHeader}>
          <Searchbar
            placeholder="Buscar por nombre, codigo de barras..."
            onSearch={handleSearch}
          />
          <Button variant="primary" size="medium" onClick={handleNavigation}>
            Añadir Movimiento
          </Button>
        </div>
      </div>
      <div className={styles.BodyContainer}>
        <div className={styles.left}>
          <Sidebar />
        </div>
        <div className={styles.right}></div>
      </div>
    </div>
  );
};

export default MovementsPage;
