import React, { useState } from "react";
import Input from "./shared/components/form/Input"; // Ajusta la ruta según tu estructura de carpetas

const Test = () => {
  const [formData, setFormData] = useState({ text: "", email: "" });

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "20px" }}>
      <h2>Componente Input</h2>

      <Input
        label="Nombre"
        type="text"
        placeholder="Escribe tu nombre"
        name="text"
        onValueChange={handleChange}
      />

      <Input
        label="Correo Electrónico"
        type="email"
        placeholder="correo@example.com"
        name="email"
        onValueChange={handleChange}
      />
    </div>
  );
};

export default Test;
