import React, { useState, useContext } from "react";
import { useAuthContext } from "../../../shared/context/AuthContext";
import Input from "../../../shared/components/form/Input";
import Button from "../../../shared/components/buttons/Button";
import Card from "../../../shared/components/structure/Card";
import { ToastContext } from "../../../shared/context/ToastContext"; // Importar ToastContext
import styles from "./LoginForm.module.css";
import { Link } from "react-router-dom"; // Importamos Link de React Router DOM

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuthContext();
  const { addNotification } = useContext(ToastContext); // Obtener addNotification del contexto

  // Validar los campos del formulario
  const validateFields = () => {
    if (!email.trim()) {
      addNotification("El correo electrónico es obligatorio.", "error");
      return false;
    }
    if (!password.trim()) {
      addNotification("La contraseña es obligatoria.", "error");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      addNotification(
        "El correo electrónico no tiene un formato válido.",
        "error"
      );
      return false;
    }
    return true;
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return; // Si la validación falla, detener el envío

    try {
      await login(email, password); // Intentar iniciar sesión
    } catch (error) {
      addNotification(error.message || "Ocurrió un error inesperado.", "error"); // Mostrar mensaje de error
    }
  };

  return (
    <Card className={styles.card}>
      <div className={styles.imgContainer}>
        <img
          className={styles.imgLogo}
          src="https://jpctdxgxtcilpeqfqull.supabase.co/storage/v1/object/public/product_images/public/c004079a-11db-4b85-8fa1-05a6ef0e6d9f/logo.png"
          alt="Logo"
        />
      </div>
      <h2 className={styles.title}>Iniciar Sesión</h2>

      {/* Usar el componente Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Campo de correo electrónico */}
        <Input
          label="Correo Electrónico"
          type="email"
          placeholder="ejemplo@correo.com"
          value={email}
          onValueChange={(name, newValue) => setEmail(newValue)} // Actualizar el estado del email
        />
        {/* Campo de contraseña */}
        <Input
          label="Contraseña"
          type="password"
          placeholder="********"
          value={password}
          onValueChange={(name, newValue) => setPassword(newValue)} // Actualizar el estado del password
        />
        {/* Boton de contraseña olvidada */}
        <Link
          to={"/forgot-password"}
          target={"_self"}
          rel={"_self" === "_blank" ? "noopener noreferrer" : undefined}
          className={`${styles.linkButton}`}
        >
          <span>¿Has olvidado tu contraseña?</span>
        </Link>
        {/* Botón de inicio de sesión */}
        <Button
          type="submit"
          variant="secondary"
          size="large"
          disabled={loading}
        >
          {loading ? "Cargando..." : "Acceder"}
        </Button>
      </form>
    </Card>
  );
};

export default LoginForm;
