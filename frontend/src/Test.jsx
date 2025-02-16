import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Table from "./shared/components/data-display/Table";
import Pagination from "./shared/components/data-display/Pagination";

const Test = () => {
  // Datos de ejemplo para la tabla
  const columns = [
    { label: "ID", key: "id" },
    { label: "Nombre", key: "name" },
    { label: "Edad", key: "age" },
  ];

  const allData = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Persona ${i + 1}`,
    age: 20 + (i % 30),
  }));

  // Paginación: solo mostrar 10 filas por página
  const rowsPerPage = 10;
  const totalPages = Math.ceil(allData.length / rowsPerPage);

  // Obtener los datos de la página actual
  const getDataForCurrentPage = (currentPage) => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return allData.slice(startIndex, endIndex);
  };

  // Obtener la página actual desde la URL
  const [searchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  // Estado para los datos actuales
  const [data, setData] = useState(getDataForCurrentPage(currentPage));

  useEffect(() => {
    // Actualiza los datos cuando la página actual cambie
    setData(getDataForCurrentPage(currentPage));
  }, [currentPage]); // Se activa cuando `currentPage` cambia

  // Manejar la selección de filas en la tabla
  const handleSelectRows = (selectedRows) => {
    console.log("Filas seleccionadas:", selectedRows);
  };

  return (
    <div>
      <h1>Test de la Tabla con Paginación</h1>
      <Table
        columns={columns}
        data={data} // Se pasa la data actualizada
        allData={allData} // Pasa todos los datos para manejar la selección
        onSelectRows={handleSelectRows}
      />
      <Pagination totalPages={totalPages} />
    </div>
  );
};

export default Test;
