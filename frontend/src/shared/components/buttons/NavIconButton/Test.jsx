import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import NavIconButton from "./shared/components/buttons/NavIconButton"; // Ajusta la ruta según tu estructura de carpetas
import { FaHome, FaUser, FaCog, FaInfoCircle } from "react-icons/fa";

const Test = () => {
  return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
        <h2>Componente NavIconButton</h2>
        <div style={{ marginBottom: "10px" }}>
          <NavIconButton to="/home" size="medium" icon={<FaHome />} />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <NavIconButton to="/profile" size="large" icon={<FaUser />} />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <NavIconButton to="/settings" size="small" icon={<FaCog />} />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <NavIconButton to="/about" size="medium" icon={<FaInfoCircle />} disabled />
        </div>
      </div>
  );
};

export default Test;
