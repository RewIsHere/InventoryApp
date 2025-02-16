import React, { useState } from "react";
import { motion } from "framer-motion";
import NavButton from "../../buttons/NavButton";
import styles from "./Navbar.module.css";
import HomeIcon from "@Assets/Home.svg?react";
import ProductsIcon from "@Assets/Products.svg?react";
import MovementsIcon from "@Assets/Movements.svg?react";
import UsersIcon from "@Assets/Users.svg?react";

const Navbar = () => {
  const [isAnimated, setIsAnimated] = useState(false);

  return (
    <motion.nav
      className={styles.navbar}
      initial={{ opacity: 0, y: 25 }} // Comienza con opacidad 0 y desplazado hacia arriba
      animate={{ opacity: 1, y: isAnimated ? 0 : -10 }} // Cambia 'y' a 0 después de la animación
      transition={{ duration: 0.5, ease: "easeOut" }} // Duración de la animación
      onAnimationComplete={() => setIsAnimated(true)} // Setea el estado después de la animación
      layout // Habilita la animación del layout
    >
      {/* Enlaces de Navegación */}
      <div className={styles.links}>
        <NavButton
          to="/dashboard"
          size="small"
          icon={<HomeIcon />}
          isActive={location.pathname === "/dashboard"}
        >
          Inicio
        </NavButton>
        <NavButton
          to="/products"
          size="small"
          icon={<ProductsIcon />}
          isActive={location.pathname === "/products"}
        >
          Productos
        </NavButton>
        {/*
        <NavButton
          to="/movements"
          size="small"
          icon={<MovementsIcon />}
          isActive={location.pathname === "/movements"}
        >
          Movimientos
        </NavButton>
        <NavButton
          to="/pending-products"
          size="small"
          icon={<UsersIcon />}
          isActive={location.pathname === "/profile"}
        >
          Productos Pendientes
        </NavButton>*/}
        <NavButton
          to="/users"
          size="small"
          icon={<UsersIcon />}
          isActive={location.pathname === "/profile"}
        >
          Usuarios y Roles
        </NavButton>
      </div>
    </motion.nav>
  );
};

export default Navbar;
