import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./UsersPage.module.css";
import Sidebar from "../components/Sidebar";
import { Button } from "@Buttons";
import UserTable from "../components/UserTable";
import Searchbar from "../components/Searchbar";

const UsersPage = () => {
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
    navigate("/users/add"); // Cambia "/otra-ruta" por la URL deseada
  };

  return (
    <div className={styles.MainContainer}>
      <div className={styles.PageHeader}>
        <div className={styles.PageTitle}>
          <h1 className={styles.titleText}>Usuarios</h1>
        </div>
        <div className={styles.rightHeader}>
          <Searchbar
            placeholder="Buscar por nombre.."
            onSearch={handleSearch}
          />
          <Button variant="primary" size="medium" onClick={handleNavigation}>
            Añadir Usuario
          </Button>
        </div>
      </div>
      <div className={styles.BodyContainer}>
        <div className={styles.left}>
          <Sidebar />
        </div>
        <div className={styles.right}>
          <UserTable />
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
