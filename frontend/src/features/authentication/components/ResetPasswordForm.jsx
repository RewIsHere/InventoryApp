import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../../../shared/context/AuthContext";
import Input from "@Form/Input";
import Button from "@Buttons/Button";
import Card from "@Structure/Card";
import { ToastContext } from "../../../shared/context/ToastContext";
import styles from "./ResetPasswordForm.module.css";
import { validateResetTokenService } from "../services/authService";

const ResetPasswordForm = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tokenValid, setTokenValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPasswordReset, setIsPasswordReset] = useState(false); // Nuevo estado
  const navigate = useNavigate();
  const location = useLocation();
  const { resetPassword } = useAuthContext();
  const { addNotification } = React.useContext(ToastContext);

  // Extraer el token de la URL
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  // Validar el token al cargar la página
  useEffect(() => {
    if (isPasswordReset) return; // Evitar ejecutar el efecto si la contraseña ya fue restablecida

    const validateToken = async () => {
      try {
        if (!token) {
          throw new Error("No se proporcionó un token.");
        }
        await validateResetTokenService(token); // Llamar al servicio para validar el token
        setTokenValid(true);
      } catch (err) {
        setError(err.message || "El token no es válido o ha expirado.");
        setTimeout(() => navigate("/forgot-password"), 3000); // Redirigir después de 3 segundos
      } finally {
        setLoading(false);
      }
    };
    validateToken();
  }, [token, navigate, isPasswordReset]); // Agregar `isPasswordReset` como dependencia

  // Validar los campos del formulario
  const validateFields = () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      addNotification("Todos los campos son obligatorios.", "error");
      return false;
    }
    if (newPassword !== confirmPassword) {
      addNotification("Las contraseñas no coinciden.", "error");
      return false;
    }
    return true;
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    try {
      const response = await resetPassword(token, newPassword);

      // Verificar si la respuesta indica éxito
      if (response && response.message === "Password updated successfully") {
      setIsPasswordReset(true); // Indicar que la contraseña fue restablecida
    } 
    } catch (error) {
      addNotification(error.message || "Ocurrió un error inesperado.", "error");
    }
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!tokenValid) {
    return <p>{error}</p>;
  }

  if (isPasswordReset) {
    return null; // Renderizar `null` para evitar que el componente siga mostrándose
  }

  return (
    <Card className={styles.card}>
      <div className={styles.imgContainer}>
        <img
          className={styles.imgLogo}
          src="https://jpctdxgxtcilpeqfqull.supabase.co/storage/v1/object/public/product_images/public/c004079a-11db-4b85-8fa1-05a6ef0e6d9f/logo.png"
          alt="Logo"
        />
      </div>
      <h2 className={styles.title}>Restablecer Contraseña</h2>
      <p style={{ color: "gray", marginBottom: "30px" }}>Introduce una nueva contraseña.</p>
      {/* Usar el componente Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Campo de nueva contraseña */}
        <Input
          label="Nueva Contraseña"
          type="password"
          placeholder="Ingresa tu nueva contraseña"
          value={newPassword}
          onValueChange={(name, newValue) => setNewPassword(newValue)}
        />
        {/* Campo de confirmar contraseña */}
        <Input
          label="Confirmar Contraseña"
          type="password"
          placeholder="Confirma tu nueva contraseña"
          value={confirmPassword}
          onValueChange={(name, newValue) => setConfirmPassword(newValue)}
        />
        {/* Botón de restablecer contraseña */}
        <Button
          type="submit"
          variant="secondary"
          size="large"
        >
          Restablecer Contraseña
        </Button>
      </form>
    </Card>
  );
};

export default ResetPasswordForm;