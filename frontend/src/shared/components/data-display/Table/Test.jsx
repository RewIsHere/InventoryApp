import React, { useState } from "react";
import Table from "./shared/components/data-display/Table"; // Ajusta la ruta según tu estructura de carpetas

const Test = () => {
  const columns = [
    { label: "ID", key: "id" },
    { label: "Nombre", key: "name" },
    { label: "Edad", key: "age" },
  ];

  const data = [
    { id: 1, name: "Juan", age: 28 },
    { id: 2, name: "Ana", age: 32 },
    { id: 3, name: "Carlos", age: 25 },
    { id: 4, name: "Sofía", age: 29 },
  ];

  const handleSelectRows = (selectedRows) => {
    console.log("Filas seleccionadas:", selectedRows);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Prueba del componente Table</h2>
      <Table columns={columns} data={data} onSelectRows={handleSelectRows} />
    </div>
  );
};

export default Test;
