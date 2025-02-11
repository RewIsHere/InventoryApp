import React, { useState } from "react";
import TextWithIcon from "./shared/components/buttons/TextWithIcon"; // Ajusta la ruta según tu estructura de carpetas
import { FaBeer } from "react-icons/fa"; // Puedes elegir otro ícono de react-icons

const Test = () => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked((prevState) => !prevState);
  };

  return (
    <div style={{ padding: "20px", width: "300px" }}>
      <h2>Prueba el componente TextWithIcon</h2>
      <TextWithIcon
        icon={<FaBeer />}  // Aquí se pasa el ícono
        text="Haz clic aquí"
        onClick={handleClick}
      />
      {clicked && <p>¡El ícono fue clickeado!</p>}
    </div>
  );
};

export default Test;
