import React from "react";
import NavButton from "../../buttons/NavButton";
import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      {/* Enlaces de Navegación */}
      <div className={styles.links}>
        <NavButton to="/" variant="solid" >
          Inicio
        </NavButton>
        <NavButton to="/productos" >
          Productos
        </NavButton>
        <NavButton to="/movimientos" >
          Movimientos
        </NavButton>
        <NavButton to="/perfil" >
          Perfil
        </NavButton>
      </div>
    </nav>
  );
};

export default Navbar;