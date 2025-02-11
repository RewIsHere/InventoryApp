import React from "react";
import Divider from "./shared/components/structure/Divider"; // Ajusta la ruta según tu estructura de carpetas

const Test = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Prueba del Componente Divider</h2>
      
      {/* Divider horizontal */}
      <p>Este es un Divider horizontal:</p>
      <Divider orientation="horizontal" size="2px" color="blue" />
      
      {/* Espacio entre los dividers */}
      <div style={{ margin: "20px 0" }}></div>
      
      {/* Divider vertical */}
      <p>Este es un Divider vertical:</p>
      <div style={{ display: "flex", justifyContent: "space-between", height: "150px" }}>
        <Divider orientation="vertical" size="1px" color="gray" height="20%" />
      </div>
    </div>
  );
};

export default Test;
