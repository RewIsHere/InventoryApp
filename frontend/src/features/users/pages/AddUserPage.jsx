import React, { useState, useContext } from "react";
import styles from "./AddUserPage.module.css";
import { Card, Divider } from "@Structure";
import { Form, Input, Select } from "@Form";
import { Button } from "@Buttons";
import { ToastContext } from "../../../shared/context/ToastContext";
import { useCreateUser } from "../hooks/useCreateUser";
import { useNavigate } from "react-router-dom";
import { NavIconButton } from "@/shared/components/buttons";
import BackIcon from "@Assets/Back.svg?react";

const AddUserPage = () => {
  const { addNotification } = useContext(ToastContext);
  const { createUser, loading } = useCreateUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    surnames: "",
    email: "",
    password: "",
    role: "",
  });

  const [errorUsername, setErrorUsername] = useState("");
  const [errorEmail, setErrorEmail] = useState("");

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    return (
      formData.username.trim() !== "" &&
      formData.name.trim() !== "" &&
      formData.surnames.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.password.trim() !== "" &&
      formData.role.trim() !== ""
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      addNotification(
        "Por favor, completa todos los campos correctamente.",
        "error"
      );
      return;
    }

    try {
      const response = await createUser(formData);
      if (response) {
        addNotification("Usuario creado con éxito.", "success");

        navigate("/users");
      } else {
        addNotification("La respuesta del servidor no es válida.", "error");
      }
      // Limpiar formulario
      setFormData({
        username: "",
        name: "",
        surnames: "",
        email: "",
        password: "",
        role: "",
      });
    } catch (error) {
      addNotification(error.message, "error");
    }
  };

  const roleOptions = [
    { label: "Admin", value: "admin" },
    { label: "Empleado", value: "employee" },
    { label: "Super Admin", value: "superadmin" },
  ];

  return (
    <div className={styles.addUserPage}>
      <div className={styles.mainContainer}>
        <Card className={styles.card}>
          <NavIconButton icon={<BackIcon />} size="medium" to="/users" />

          <h1>Agregar Usuario</h1>
          <Form className={styles.form} onSubmit={handleSubmit}>
            <Input
              label="Username"
              placeholder="Escribe el username"
              name="username"
              value={formData.username}
              onValueChange={handleInputChange}
              error={errorUsername}
              required
            />
            <Input
              label="Nombre"
              placeholder="Escribe el nombre"
              name="name"
              value={formData.name}
              onValueChange={handleInputChange}
              required
            />
            <Input
              label="Apellidos"
              placeholder="Escribe los apellidos"
              name="surnames"
              value={formData.surnames}
              onValueChange={handleInputChange}
              required
            />
            <Input
              label="Correo Electrónico"
              placeholder="Escribe el correo"
              name="email"
              value={formData.email}
              onValueChange={handleInputChange}
              error={errorEmail}
              required
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="Escribe la contraseña"
              name="password"
              value={formData.password}
              onValueChange={handleInputChange}
              required
            />
            <Select
              label="Rol"
              options={roleOptions}
              value={formData.role}
              onChange={(value) => handleInputChange("role", value)}
              required
            />
            <Button
              type="submit"
              variant="primary"
              size="medium"
              disabled={loading || !isFormValid()}
            >
              {loading ? "Creando..." : "Crear Usuario"}
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default AddUserPage;
