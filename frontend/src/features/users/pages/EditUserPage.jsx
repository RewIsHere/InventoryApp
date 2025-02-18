import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/shared/components/structure";
import { Form, Input, Select } from "@/shared/components/form";
import { Button } from "@/shared/components/buttons";
import { useUpdateUser } from "../hooks/useUser"; // Hook para editar usuario
import { getUserDetailsService } from "../services/userService"; // Servicio para obtener usuario por ID
import { ToastContext } from "../../../shared/context/ToastContext";
import { NavIconButton } from "@/shared/components/buttons";
import BackIcon from "@Assets/Back.svg?react";
import useFormStore from "../../../shared/stores/useFormStore"; // Importa el estado de Zustand
import styles from "./EditUserPage.module.css";

const EditUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useContext(ToastContext);
  const { formData, setFormData, resetFormData } = useFormStore(); // Usa el estado de Zustand

  const [roles, setRoles] = useState([]); // Estado para almacenar los roles
  const { loading, updateUser } = useUpdateUser();
  const [originalData, setOriginalData] = useState({}); // Estado para almacenar los datos originales

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("Fetching user with ID:", id);
        const user = await getUserDetailsService(id);

        // Inicializa el formulario con los datos del usuario y almacena los datos originales
        console.log("Fetched user data:", user);
        setOriginalData({
          username: user.username,
          name: user.name,
          surnames: user.surnames,
          email: user.email,
          password: "", // La contraseña se manejará como un campo vacío en el formulario
          role: user.role,
        });

        resetFormData({
          username: user.username,
          name: user.name,
          surnames: user.surnames,
          email: user.email,
          password: "",
          role: user.role,
        });

        setRoles([
          { value: "admin", label: "Administrador" },
          { value: "superadmin", label: "Superadministrador" },
          { value: "employee", label: "Empleado" },
        ]);
      } catch (error) {
        console.error("Error al cargar el usuario:", error);
        addNotification("Error al cargar el usuario.", "error");
        navigate("/users");
      }
    };

    fetchUser();
  }, [id, addNotification, navigate, resetFormData]);

  const handleInputChange = (name, value) => {
    console.log(`Input changed: ${name} = ${value}`);
    setFormData({ [name]: value });
  };

  const isFormValid = () => {
    console.log("Validating form:", formData);
    return (
      (formData.username?.trim() !== "" || formData.username === "") &&
      (formData.email?.trim() !== "" || formData.email === "") &&
      (formData.role?.trim() !== "" || formData.role === "")
    );
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);

    if (!isFormValid()) {
      addNotification(
        "Por favor, completa todos los campos correctamente.",
        "error"
      );
      return;
    }

    // Comparar los valores actuales con los originales
    const modifiedFields = {};
    console.log(
      "Comparing form data with original data:",
      formData,
      originalData
    );
    for (const key in formData) {
      const currentValue = formData[key]?.trim().toLowerCase(); // Eliminar espacios en blanco y pasar a minúsculas
      const originalValue = originalData[key]?.trim().toLowerCase(); // Lo mismo para los datos originales

      console.log(`Comparing ${key}:`, currentValue, originalValue);

      // Solo agregar campos que han cambiado y no están vacíos
      if (currentValue !== originalValue && currentValue !== "") {
        modifiedFields[key] = currentValue;
      }
    }

    if (Object.keys(modifiedFields).length === 0) {
      addNotification("No se realizaron cambios en los datos.", "error");
      return;
    }

    console.log("Sending modified fields to the server:", modifiedFields);
    try {
      const response = await updateUser(id, modifiedFields);
      if (response) {
        navigate("/users");
      } else {
        addNotification("La respuesta del servidor no es válida.", "error");
      }
    } catch (err) {
      console.error("Error al actualizar el usuario:", err);
      addNotification("Ocurrió un error al actualizar el usuario.", "error");
    }
  };

  return (
    <div className={styles.editUserPage}>
      <div className={styles.mainContainer}>
        <Card className={styles.card}>
          <NavIconButton icon={<BackIcon />} size="medium" to="/users" />
          <h1>Editar Usuario</h1>
          <Form className={styles.form} onSubmit={handleSubmit}>
            <Input
              label="Nombre de Usuario"
              type="text"
              placeholder="Nombre de usuario"
              name="username"
              value={formData.username} // Usamos "value" en lugar de "defaultValue"
              onValueChange={handleInputChange} // Usa el onValueChange para pasar el nuevo valor
              required
            />
            <Input
              label="Nombre"
              type="text"
              placeholder="Nombre completo"
              name="name"
              value={formData.name} // Usamos "value" en lugar de "defaultValue"
              onValueChange={handleInputChange} // Usa el onValueChange para pasar el nuevo valor
              required
            />
            <Input
              label="Apellidos"
              type="text"
              placeholder="Apellidos completos"
              name="surnames"
              value={formData.surnames} // Usamos "value" en lugar de "defaultValue"
              onValueChange={handleInputChange} // Usa el onValueChange para pasar el nuevo valor
              required
            />
            <Input
              label="Correo Electrónico"
              type="email"
              placeholder="Correo electrónico"
              name="email"
              value={formData.email} // Usamos "value" en lugar de "defaultValue"
              onValueChange={handleInputChange} // Usa el onValueChange para pasar el nuevo valor
              required
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="Nueva contraseña (opcional)"
              name="password"
              value={formData.password} // Usamos "value" en lugar de "defaultValue"
              onValueChange={handleInputChange} // Usa el onValueChange para pasar el nuevo valor
            />
            <Select
              label="Rol"
              name="role"
              value={formData.role} // Usamos "value" para que sea controlado
              onValueChange={handleInputChange} // Usa el onValueChange para pasar el nuevo valor
              options={roles}
              required
            />
            <Button
              type="submit"
              variant="primary"
              size="medium"
              disabled={loading || !isFormValid()}
            >
              {loading ? "Actualizando..." : "Guardar Cambios"}
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default EditUserPage;
