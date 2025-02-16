import React from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { Card } from "@Structure";
import { ButtonGroup, TextWithIcon } from "@Buttons";
import { Select } from "@Form";
import RefreshIcon from "@Assets/Refresh.svg?react";
import { useCategories } from "../hooks/useCategories";

const Sidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories, loading, error } = useCategories();

  // Estado del producto
  const statusOptions = ["TODOS", "ACTIVO", "INACTIVO"];
  const currentStatus = searchParams.get("status") || "TODOS";

  // Ordenar Por
  const sortByOptions = [
    { value: "name_asc", label: "ALFABÉTICO: A-Z" },
    { value: "name_desc", label: "ALFABÉTICO: Z-A" },
    { value: "stock_asc", label: "STOCK: BAJO A ALTO" },
    { value: "stock_desc", label: "STOCK: ALTO A BAJO" },
  ];
  const currentSort = searchParams.get("sort") || "name_asc";

  const currentCategoryName = searchParams.get("category") || "all";
  const currentCategoryUUID =
    currentCategoryName === "all"
      ? "all"
      : categories.find((cat) => cat.name === currentCategoryName)?.id || null;

  // Función para actualizar los filtros asegurando que 'page' no esté en la URL
  const updateFilter = (key, value) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.delete("page"); // Eliminar 'page' antes de actualizar el filtro

      if (value === "all" || value === "TODOS") {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }

      return newParams;
    });
  };

  // Reiniciar filtros
  const resetFilters = () => {
    setSearchParams({});
  };

  // Manejar la selección de categoría
  const handleCategoryChange = (selectedCategoryUUID) => {
    if (selectedCategoryUUID === "all") {
      updateFilter("category", "all");
    } else {
      const selectedCategory = categories.find(
        (cat) => cat.id === selectedCategoryUUID
      );
      if (selectedCategory) {
        updateFilter("category", selectedCategory.name);
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
        <span>TIPO DE MOVIMIENTO</span>
        <ButtonGroup
          options={statusOptions}
          onSelect={(option) => updateFilter("status", option)}
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
