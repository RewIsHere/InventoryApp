import React, { useState, useContext } from "react";
import { useAuthContext } from "../../../shared/context/AuthContext";
import Input from "@Form/Input";
import Button from "@Buttons/Button";
import Card from "@Structure/Card";
import { ToastContext } from "../../../shared/context/ToastContext"; // Importar ToastContext
import styles from "./ForgotPasswordForm.module.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const { forgotPassword, loading } = useAuthContext();
  const { addNotification } = useContext(ToastContext); // Obtener addNotification del contexto

  // Validar los campos del formulario
  const validateFields = () => {
    if (!email.trim()) {
      addNotification("El correo electrónico es obligatorio.", "error");
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
      await forgotPassword(email); // Intentar iniciar sesión
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
      <h2 className={styles.title}>Recupecion de Contraseña</h2>
      <p style={{ color: "gray", marginBottom: "30px" }}>
        Introduce tu correo electrónico para buscar tu cuenta.
      </p>
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
