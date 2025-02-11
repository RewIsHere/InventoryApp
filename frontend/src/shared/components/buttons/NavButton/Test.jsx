import React from "react";
import { BrowserRouter as Router } from "react-router-dom"; // Para envolver los componentes con el Router
import { FaHome, FaInfoCircle, FaTools, FaPhoneAlt } from "react-icons/fa"; // Importa los iconos de React Icons
import NavButton from "./shared/components/buttons/NavButton"; // Ajusta la ruta según tu estructura de carpetas

const Test = () => {
  return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
        <h2>Componente NavButton</h2>
        <div style={{ marginBottom: "10px" }}>
          <NavButton to="/home" size="medium" variant="outline" icon={<FaHome />}>
            Home
          </NavButton>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <NavButton to="/about" size="medium" variant="primary" icon={<FaInfoCircle />}>
            About
          </NavButton>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <NavButton to="/services" size="small" variant="outline" icon={<FaTools />}>
            Services
          </NavButton>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <NavButton to="/contact" size="large" variant="secondary" icon={<FaPhoneAlt />}>
            Contact
          </NavButton>
        </div>
      </div>
  );
};

export default Test;