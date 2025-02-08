import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoginForm from "../components/LoginForm";
import styles from "./LoginPage.module.css";

const LoginPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirigir al dashboard si el usuario ya está autenticado
  React.useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  return (
    <div className={styles.page}>
      <LoginForm />
    </div>
  );
};

export default LoginPage;