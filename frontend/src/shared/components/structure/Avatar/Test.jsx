import React from "react";
import AvatarWithDropdown from "./shared/components/structure/Avatar"; // Asegúrate de que AvatarWithDropdown esté correctamente importado
import { FaUser, FaCog, FaSignOutAlt } from "react-icons/fa"; // Ejemplo de iconos

const Test = () => {
  const options = [
    { icon: <FaUser />, text: "Perfil", onClick: () => console.log("Perfil clicked") },
    { icon: <FaCog />, text: "Configuraciones", onClick: () => console.log("Configuraciones clicked") },
    { icon: <FaSignOutAlt />, text: "Cerrar sesión", onClick: () => console.log("Cerrar sesión clicked") },
  ];

  return (
    <div style={{display: "flex",  justifyContent: "center", alignItems: "center"}}>
      <h2>Prueba del Avatar con Dropdown</h2>
      <AvatarWithDropdown
        name="John Doe"
        size="50px"
        backgroundColor="blue"
        textColor="white"
        options={options}
      />
    </div>
  );
};

export default Test;
