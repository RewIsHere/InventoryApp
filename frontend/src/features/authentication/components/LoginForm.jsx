import React, { useState } from "react";
import { useAuthContext } from "../../../shared/context/AuthContext";
import Input from "../../../shared/components/form/Input";
import Button from "../../../shared/components/buttons/Button";
import Card from "../../../shared/components/structure/Card";
import styles from "./LoginForm.module.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuthContext();

  const validateFields = () => {
    if (!email.trim()) {
      throw new Error("El correo electrónico es obligatorio.");
    }
    if (!password.trim()) {
      throw new Error("La contraseña es obligatoria.");
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      throw new Error("El correo electrónico no tiene un formato válido.");
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      validateFields();
      await login(email, password);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <Card className={styles.card}>
      <div className={styles.imgContainer}>
      <img className={styles.imgLogo}  src="https://jpctdxgxtcilpeqfqull.supabase.co/storage/v1/object/public/product_images/public/c004079a-11db-4b85-8fa1-05a6ef0e6d9f/logo.png" alt="" />
      </div>
      <h2 className={styles.title}>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Correo Electrónico"
          type="email"
          placeholder="ejemplo@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Contraseña"
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
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