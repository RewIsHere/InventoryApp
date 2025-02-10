import React, { useState } from "react";
import Textarea from "./shared/components/form/Textarea"; // Ajusta la ruta según tu estructura

const Test = () => {
  const [text1, setText1] = useState("");
  const [error1, setError1] = useState("");
  const [text2, setText2] = useState("");
  const [error2, setError2] = useState("");

  const handleChange1 = (e) => {
    const value = e.target.value;
    setText1(value);
    // Limpiar el error cuando se alcance el mínimo de caracteres
    if (value.length < 5) {
      setError1("Debe tener al menos 5 caracteres");
    } else {
      setError1(""); // Limpiar el error cuando el texto es suficiente
    }
  };

  const handleChange2 = (e) => {
    const value = e.target.value;
    setText2(value);
    // Limpiar el error cuando se alcance el mínimo de caracteres
    if (value.length < 5) {
      setError2("Debe tener al menos 5 caracteres");
    } else {
      setError2(""); // Limpiar el error cuando el texto es suficiente
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px", width: "100%" }}>
      <h2>Componente Textarea</h2>
      
      <Textarea
        label="Descripción 1"
        placeholder="Escribe algo..."
        value={text1}
        onChange={handleChange1}
        error={error1}
        size="large"
      />

      <Textarea
        label="Descripción 2"
        placeholder="Escribe algo..."
        value={text2}
        onChange={handleChange2}
        error={error2}
        size="medium"
      />

      <Textarea
        label="Descripción 3"
        placeholder="Escribe algo..."
        value={text2}
        onChange={handleChange2}
        error={error2}
        size="small"
      />
    </div>
  );
};

export default Test;
