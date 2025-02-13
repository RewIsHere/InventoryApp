// src/features/products/components/Sidebar.jsx
import React from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { Card } from "@Structure";
import { ButtonGroup, TextWithIcon } from "@Buttons";
import { Select } from "@Form";
import RefreshIcon from "@Assets/Refresh.svg?react";
import useProductStore from "../../../shared/stores/productStore";
import { useCategories } from "../hooks/useCategories";

const Sidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories, loading, error } = useCategories();
  const { filters, applyFilters } = useProductStore();

  // Estado del producto
  const statusOptions = ["TODOS", "ACTIVO", "INACTIVO"];
  const currentStatus = filters.status || "TODOS";

  // Ordenar Por
  const sortByOptions = [
    { value: "name_asc", label: "ALFABÉTICO: A-Z" },
    { value: "name_desc", label: "ALFABÉTICO: Z-A" },
    { value: "stock_asc", label: "STOCK: BAJO A ALTO" },
    { value: "stock_desc", label: "STOCK: ALTO A BAJO" },
  ];
  const currentSort = filters.sort || "name_asc";

  // Alerta de Stock
  const stockAlertOptions = [
    { value: "all", label: "TODOS" },
    { value: "low", label: "BAJO" },
    { value: "normal", label: "NORMAL" },
    { value: "out_of_stock", label: "SIN STOCK" },
  ];
  const currentStockAlert = filters.stock_alert || "all";

  // Categoría
  const categoryOptions = [
    { value: "all", label: "TODOS" },
    ...categories.map((category) => ({
      value: category.id,
      label: category.name,
    })),
  ];

  // Obtener el nombre de la categoría actual desde el estado global
  const currentCategoryName = filters.category || "all";
  const currentCategoryUUID =
    currentCategoryName === "all"
      ? "all"
      : categories.find((cat) => cat.name === currentCategoryName)?.id || null;

  // Función para actualizar los filtros
  const updateFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    applyFilters(newFilters); // Aplicar filtros en Zustand
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (value === "all" || value === "TODOS") {
        newParams.delete(key); // Eliminar el parámetro si es "all" o "TODOS"
      } else {
        newParams.set(key, value);
      }
      return newParams;
    });
  };

  // Reiniciar filtros
  const resetFilters = () => {
    applyFilters({}); // Limpiar filtros en Zustand
    setSearchParams({}); // Limpiar parámetros de la URL
  };

  // Manejar la selección de categoría
  const handleCategoryChange = (selectedCategoryUUID) => {
    if (selectedCategoryUUID === "all") {
      updateFilter("category", "all"); // Limpiar el parámetro "category"
    } else {
      const selectedCategory = categories.find(
        (cat) => cat.id === selectedCategoryUUID
      );
      if (selectedCategory) {
        updateFilter("category", selectedCategory.name); // Usar el nombre en la URL
      }
    }
  };

  if (loading) {
    return <div>Cargando categorías...</div>;
  }

  if (error) {
    return <div>Ocurrió un error: {error}</div>;
  }

  return (
    <Card className={styles.container}>
      {/* Estado del Producto */}
      <div className={styles.statusContainer}>
        <span>ESTADO DEL PRODUCTO</span>
        <ButtonGroup
          options={statusOptions}
          onSelect={(option) =>
            option === "TODOS"
              ? updateFilter("status", "TODOS")
              : updateFilter("status", option)
          }
          selected={currentStatus}
        />
      </div>

      {/* Ordenar Por */}
      <div className={styles.sortContainer}>
        <span>ORDENAR POR</span>
        <Select
          options={sortByOptions}
          value={currentSort}
          onChange={(value) => updateFilter("sort", value)}
          size="medium"
        />
      </div>

      {/* Alerta de Stock */}
      <div className={styles.stockAlertContainer}>
        <span>ALERTA DE STOCK</span>
        <Select
          options={stockAlertOptions}
          value={currentStockAlert}
          onChange={(value) => updateFilter("stock_alert", value)}
          size="medium"
        />
      </div>

      {/* Categoría */}
      <div className={styles.categoryContainer}>
        <span>CATEGORÍA</span>
        <Select
          options={categoryOptions}
          value={currentCategoryUUID} // Usar el UUID interno o "all"
          onChange={handleCategoryChange} // Manejar la selección de categoría
          size="medium"
        />
      </div>

      {/* Reiniciar Filtros */}
      <div className={styles.resetContainer}>
        <TextWithIcon
          icon={<RefreshIcon />}
          text="Reiniciar filtros"
          onClick={resetFilters}
        />
      </div>
    </Card>
  );
};

export default Sidebar;
