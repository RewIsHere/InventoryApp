import React, { useState } from "react";
import Checkbox from "./shared/components/form/Checkbox";

const Test = () => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Ejemplo de Checkbox</h2>
      <Checkbox 
        label="U"
        checked={isChecked} 
        onChange={setIsChecked} 
      />
      <p>Estado: {isChecked ? "Marcado" : "No marcado"}</p>
    </div>
  );
};

export default Test;
