import React from "react";
import DropdownIconButton from "./shared/components/buttons/DropdownIconButton";
import { FiSettings, FiUser, FiLogOut } from "react-icons/fi"; // Ejemplo de iconos

const Test = () => {
  // Definir las opciones del menú desplegable
  const options = [
    { icon: <FiSettings />, text: "Configuración", value: "configuracion" },
    { icon: <FiUser />, text: "Perfil", value: "perfil" },
    { icon: <FiLogOut />, text: "Cerrar sesión", value: "cerrarSesion" },
  ];

  const mystyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  // Función para manejar la selección de una opción
  const handleOptionClick = (option) => {
    console.log(`Opción seleccionada: ${option.text}`);
    // Puedes agregar lógica para cada opción aquí
    if (option.value === "configuracion") {
      console.log("Redirigiendo a Configuración...");
    } else if (option.value === "perfil") {
      console.log("Redirigiendo a Perfil...");
    } else if (option.value === "cerrarSesion") {
      console.log("Cerrando sesión...");
    }
  };

  return (
    <div style={mystyle}>
      <h2>Componente Dropdown IconButton</h2>
      <DropdownIconButton
        icon={<FiSettings />} // Icono del botón principal
        options={options} // Pasar las opciones
        onOptionClick={handleOptionClick} // Callback para cuando se selecciona una opción
      />
    </div>
  );
};

export default Test;
