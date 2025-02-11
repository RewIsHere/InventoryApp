import React from "react";
import Navbar from "../../navigation/Navbar";
import IconButton from "../../buttons/IconButton";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      {/* Contenedor principal */}
      <div className={styles.container}>
        {/* Logo en el lado izquierdo */}

        {/* Barra de Navegación Horizontal (Centro) */}
        <Navbar />

        {/* Botones Adicionales en el Lado Derecho */}
        <div className={styles.actions}>
          <IconButton to="/notificaciones" icon={<i className="fas fa-bell"></i>} />
          <IconButton to="/configuracion" icon={<i className="fas fa-cog"></i>} />
          <IconButton to="/perfil" icon={<i className="fas fa-user-circle"></i>} />
        </div>
      </div>
    </header>
  );
};

export default Header;