import React, { useState } from "react";
import IconButton from "./shared/components/buttons/IconButton"; // Ajusta la ruta según tu estructura de carpetas
import { FaHome, FaInfoCircle, FaCog, FaTimes } from "react-icons/fa"; // Ejemplo de íconos de react-icons

const Test = () => {
  const [message, setMessage] = useState("");

  const handleClick = (iconName) => {
    setMessage(`Botón ${iconName} presionado`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
      <h2>Componente IconButton</h2>
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <IconButton icon={<FaHome />} size="medium" onClick={() => handleClick("Home")} />
        <IconButton icon={<FaInfoCircle />} size="small" onClick={() => handleClick("Info")} />
        <IconButton icon={<FaCog />} size="large" onClick={() => handleClick("Settings")} />
        <IconButton icon={<FaTimes />} size="medium" disabled />
      </div>
      <p>{message}</p>
    </div>
  );
};

export default Test;
