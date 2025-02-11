import React, { useState } from "react";
import Button from "./shared/components/buttons/Button"; // Ajusta la ruta según tu estructura de carpetas

const Test = () => {
  const [message, setMessage] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  const handleButtonClick = (variant) => {
    setMessage(`Botón de variante ${variant} presionado`);
  };

  const toggleButtonState = () => {
    setIsDisabled((prevState) => !prevState);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
      <h2>Componente Button</h2>

      {/* Botón principal de cada variante */}
      <div style={{ marginBottom: "10px" }}>
        <Button
          variant="primary"
          size="medium"
          onClick={() => handleButtonClick("primary")}
          disabled={isDisabled}
        >
          Primario
        </Button>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <Button
          variant="secondary"
          size="medium"
          onClick={() => handleButtonClick("secondary")}
          disabled={isDisabled}
        >
          Secundario
        </Button>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <Button
          variant="outline"
          size="medium"
          onClick={() => handleButtonClick("outline")}
          disabled={isDisabled}
        >
          Outline
        </Button>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <Button
          variant="primary"
          size="small"
          onClick={() => handleButtonClick("primary small")}
          disabled={isDisabled}
        >
          Primario Pequeño
        </Button>
      </div>

      {/* Botón para alternar el estado deshabilitado */}
      <div style={{ marginTop: "20px" }}>
        <Button onClick={toggleButtonState} size="small">
          {isDisabled ? "Habilitar Botones" : "Deshabilitar Botones"}
        </Button>
      </div>

      <p>{message}</p>
    </div>
  );
};

export default Test;
