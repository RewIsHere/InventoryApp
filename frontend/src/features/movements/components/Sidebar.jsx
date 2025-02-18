import React from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { Card } from "@Structure";
import { ButtonGroup, TextWithIcon } from "@Buttons";
import RefreshIcon from "@Assets/Refresh.svg?react";
import DateRangePicker from "@/shared/components/form/DataRangePicker";

const Sidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Tipo de Movimiento
  const typeOptions = ["TODOS", "ENTRADA", "SALIDA"];
  const currentType = searchParams.get("type") || "TODOS";

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
    setDateRange({ startDate: null, endDate: null });
  };

  return (
    <Card className={styles.container}>
      {/* Tipo de Movimiento */}

      <div className={styles.typeContainer}>
        <span>TIPO DE MOVIMIENTO</span>
        <ButtonGroup
          options={typeOptions}
          onSelect={(option) => updateFilter("type", option)}
          selected={currentType}
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
