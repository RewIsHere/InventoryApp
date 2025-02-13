import React from "react";
import styles from "./ProductsPage.module.css";
import Sidebar from "../components/Sidebar";
import ProductList from "../components/ProductList";

// ProductsPage.jsx
const ProductsPage = () => {
  return (
    <div className={styles.MainContainer}>
      <div className={styles.PageHeader}>
        <h1 className={styles.PageTitle}>Productos</h1>
      </div>
      <div className={styles.BodyContainer}>
        <div className={styles.left}>
          <Sidebar />
        </div>
        <div className={styles.right}>
          <ProductList />
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
