// Navbar.js
import React from "react";
import { FaHome, FaBox, FaHistory, FaUser } from "react-icons/fa"; // Importa los iconos de react-icons
import { motion } from "framer-motion";
import NavButton from "../../buttons/NavButton";
import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <motion.nav
      className={styles.navbar}
      initial={{ opacity: 0, y: 0 }} // Comienza con opacidad 0 y desplazado hacia arriba
      animate={{ opacity: 1, y: -20 }} // Se anima a opacidad 1 y sin desplazamiento
      transition={{ duration: 0.5, ease: "easeOut" }} // Duración de la animación
    >
      {/* Enlaces de Navegación */}
      <div className={styles.links}>
        <NavButton to="/" variant="solid" icon={<FaHome />}>
          Inicio
        </NavButton>
        <NavButton to="/productos" icon={<FaBox />}>
          Productos
        </NavButton>
        <NavButton to="/movimientos" icon={<FaHistory />}>
          Movimientos
        </NavButton>
        <NavButton to="/perfil" icon={<FaUser />}>
          Perfil
        </NavButton>
      </div>
    </motion.nav>
  );
};

export default Navbar;
