import React, { useState } from "react";
import ButtonGroup from "./shared/components/buttons/ButtonGroup"; // Ajusta la ruta según tu estructura de carpetas

const Test = () => {
  const options = ["Opción 1", "Opción 2", "Opción 3"];

  // Inicializamos el estado con la primera opción
  const [selectedOption, setSelectedOption] = useState(options[2]);

  const handleSelect = (option) => {
    setSelectedOption(option);
  };

  return (
    <div style={{ padding: "20px", width: "300px" }}>
      <h2>Selecciona una opción</h2>
      <ButtonGroup options={options} onSelect={handleSelect} selected={selectedOption} />
      <p>Opción seleccionada: {selectedOption}</p>
    </div>
  );
};

export default Test;
