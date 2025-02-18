import React from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { Card } from "@Structure";
import { ButtonGroup, TextWithIcon } from "@Buttons";
import { Select, Input } from "@Form";
import RefreshIcon from "@Assets/Refresh.svg?react";

const Sidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Estado del usuario
  const statusOptions = ["TODOS", "ACTIVO", "INACTIVO"];
  const currentStatus = searchParams.get("is_active") || "TODOS";

  // Roles
  const roleOptions = [
    { value: "all", label: "TODOS" },
    { value: "superadmin", label: "SUPERADMIN" },

    { value: "admin", label: "ADMINISTRADOR" },
    { value: "employee", label: "EMPLEADO" },
  ];
  const currentRole = searchParams.get("role") || "all";

  // Ordenar Por
  const sortByOptions = [
    { value: "username_asc", label: "NOMBRE: A-Z" },
    { value: "username_desc", label: "NOMBRE: Z-A" },
    { value: "email_asc", label: "CORREO ELECTRÓNICO: A-Z" },
    { value: "email_desc", label: "CORREO ELECTRÓNICO: Z-A" },
    { value: "created_at_asc", label: "FECHA DE CREACIÓN: ANTIGUO A RECIENTE" },
    {
      value: "created_at_desc",
      label: "FECHA DE CREACIÓN: RECIENTE A ANTIGUO",
    },
  ];
  const currentSort = searchParams.get("sort") || "username_asc";

  // Búsqueda
  const currentSearch = searchParams.get("search") || "";

  // Función para actualizar los filtros
  const updateFilter = (key, value) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (value === "all" || value === "TODOS" || value === "") {
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

  return (
    <Card className={styles.container}>
      {/* Búsqueda */}

      {/* Rol */}
      <div className={styles.roleContainer}>
        <span>ROL</span>
        <Select
          options={roleOptions}
          value={currentRole}
          onChange={(value) => updateFilter("role", value)}
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
