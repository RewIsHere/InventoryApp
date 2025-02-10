import React, { useState } from "react";
import NumberInput from "./shared/components/form/NumberInput"; // Ajusta la ruta según tu estructura de carpetas

const Test = () => {
  const [value, setValue] = useState(0);

  const handleValueChange = (newValue) => {
    setValue(newValue); // Actualiza el valor cuando el input cambia
    console.log("Valor seleccionado:", newValue); // Muestra el valor seleccionado en la consola
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
      <h2>Componente NumberInput</h2>
      <NumberInput
        label="Selecciona un número"
        value={value}
        min={0} // Valor mínimo
        max={10} // Valor máximo
        step={1} // Paso de incremento/decremento
        onChange={handleValueChange} // Función para manejar el cambio
      />
      <p>Valor actual: {value}</p> {/* Muestra el valor actual */}
    </div>
  );
};

export default Test;
