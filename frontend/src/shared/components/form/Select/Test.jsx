import React, { useState, useEffect } from "react";
import Select from "./shared/components/form/Select"; // Asegúrate de ajustar la ruta según tu estructura de carpetas

const Test = () => {
  const [selectedValue, setSelectedValue] = useState(""); // Valor inicial vacío

  const handleSelectChange = (newValue) => {
    setSelectedValue(newValue); // Actualiza el valor seleccionado
  };

  // Opciones para el Select
  const options = [
    { value: "option1", label: "Opción 1" },
    { value: "option2", label: "Opción 2" },
    { value: "option3", label: "Opción 3" },
  ];

  useEffect(() => {
    // Log del valor seleccionado cada vez que cambia
    console.log("Valor seleccionado:", selectedValue);
  }, [selectedValue]); // Este hook se ejecuta cada vez que el valor cambia

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
      <h2>Componente Select</h2>
      <Select
        label="Selecciona una opción"
        options={options}
        value={selectedValue} // Pasamos el valor actual
        onChange={handleSelectChange} // Pasamos la función de manejo de cambio
        error={selectedValue === "" ? "" : ""} // Error si no se selecciona opción
        size="medium" // Puedes cambiar entre "small", "medium", o "large"
      />
      
      {/* Mostrar el valor seleccionado */}
      <p>Valor seleccionado: {selectedValue || "Ninguna opción seleccionada"}</p>
    </div>
  );
};

export default Test;
