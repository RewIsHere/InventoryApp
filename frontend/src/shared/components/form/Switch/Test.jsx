import React, { useState } from "react";
import Switch from "./shared/components/form/Switch"; // Asegúrate de que la ruta del componente sea la correcta

const Test = () => {
  // Estado para el interruptor
  const [isChecked, setIsChecked] = useState(false);

  // Función para manejar el cambio del interruptor
  const handleSwitchChange = (newCheckedState) => {
    setIsChecked(newCheckedState);
    console.log(`Estado del interruptor: ${newCheckedState ? "Activado" : "Desactivado"}`);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: "20px" }}>
      <h2>Componente Switch</h2>
      <Switch
        label="Activar opción" // Texto de la etiqueta
        checked={isChecked} // Estado actual del interruptor
        onChange={handleSwitchChange} // Callback que maneja el cambio
      />
    </div>
  );
};

export default Test;
