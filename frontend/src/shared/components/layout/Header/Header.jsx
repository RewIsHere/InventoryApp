import React from "react";
import Navbar from "../../navigation/Navbar";
import IconButton from "../../buttons/IconButton";
import NavIconButton from "@Buttons/NavIconButton";
import styles from "./Header.module.css";
import SettingsIcon from "@Assets/Settings.svg?react";
import Avatar from "@Structure/Avatar";
import { useAuthContext } from "../../../context/AuthContext"; // Importar el contexto de autenticación

const Header = () => {
  const { user, logout } = useAuthContext(); // Obtener la función handleLogout del contexto

  const displayName = `${user?.name || ""} ${user?.surnames || ""}`.trim();

  const options = [{ text: "Cerrar sesión", onClick: () => logout() }];
  return (
    <header className={styles.header}>
      {/* Contenedor principal */}
      <div className={styles.container}>
        <div className={`${styles.grow1} ${styles.left}`}>
          {/* Logo en el lado izquierdo */}
          <img
            className={styles.imgLogo}
            src="https://jpctdxgxtcilpeqfqull.supabase.co/storage/v1/object/public/product_images/public/c004079a-11db-4b85-8fa1-05a6ef0e6d9f/logo.png"
            alt="Logo"
          />
        </div>
        <div className={`${styles.grow1} ${styles.centrado}`}>
          {/* Barra de Navegación Horizontal (Centro) */}
          <Navbar />
        </div>
        <div className={`${styles.grow1} ${styles.right}`}>
          {/* Botones Adicionales en el Lado Derecho */}
          <div className={styles.actions}>
            <NavIconButton
              to="/settings"
              size="large"
              icon={<SettingsIcon />}
            />
            <Avatar
              name={displayName || "?"}
              email={user?.email}
              options={options}
              backgroundColor="#ffa53b"
              textColor="#141e22"
              size="50px"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
