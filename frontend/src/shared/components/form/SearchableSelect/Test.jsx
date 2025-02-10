import React, { useState } from "react";
import SearchableSelect from "./shared/components/form/SearchableSelect"; // Ajusta la ruta según tu estructura

const Test = () => {
  const [options, setOptions] = useState([
    { label: "Categoría 1", value: "cat1" },
    { label: "Categoría 2", value: "cat2" },
    { label: "Categoría 3", value: "cat3" },
    { label: "Categoría 4", value: "cat4" },
    { label: "Categoría 5", value: "cat5" },
    { label: "Categoría 6", value: "cat6" },
    { label: "Categoría 7", value: "cat7" },
    { label: "Categoría 8", value: "cat8" },
    { label: "Categoría 9", value: "cat9" },
    { label: "Categoría 10", value: "cat10" },
    { label: "Categoría 11", value: "cat11" },
    { label: "Categoría 12", value: "cat12" },
    { label: "Categoría 13", value: "cat13" },
    { label: "Categoría 14", value: "cat14" },
    { label: "Categoría 15", value: "cat15" },
  ]);

  const handleCreateOption = (newOption) => {
    const newOptionObject = { label: newOption, value: newOption.toLowerCase().replace(/\s+/g, "") };
    setOptions((prevOptions) => [...prevOptions, newOptionObject]);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Componente SearchableSelect</h2>
      <SearchableSelect
        options={options}
        onCreateOption={handleCreateOption}
        placeholder="Buscar categoría..."
        actionLabel="Crear nueva categoría"
      />
    </div>
  );
};

export default Test;
