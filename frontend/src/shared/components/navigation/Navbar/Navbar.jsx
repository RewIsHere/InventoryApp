import React from "react";
import NavLinkButton from "../NavLinkButton";
import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      {/* Enlaces de Navegación */}
      <div className={styles.links}>
        <NavLinkButton to="/" variant="solid" icon={<i className="fas fa-home"></i>}>
          Inicio
        </NavLinkButton>
        <NavLinkButton to="/productos" icon={<i className="fas fa-box"></i>}>
          Productos
        </NavLinkButton>
        <NavLinkButton to="/movimientos" icon={<i className="fas fa-exchange-alt"></i>}>
          Movimientos
        </NavLinkButton>
        <NavLinkButton to="/perfil" icon={<i className="fas fa-user"></i>}>
          Perfil
        </NavLinkButton>
      </div>
    </nav>
  );
};

export default Navbar;