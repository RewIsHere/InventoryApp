import React, { useState } from "react";
import Form from "./shared/components/form/Form";
import Input from "./shared/components/form/Input";
import Button from "./shared/components/buttons/Button";

const Test = () => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (name, value, error) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Actualizar errores solo si hay error, sino eliminarlo
    setErrors((prev) => {
      const newErrors = { ...prev, [name]: error };
      if (!error) delete newErrors[name];
      return newErrors;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar campos vacíos
    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (!value) newErrors[key] = "Este campo es obligatorio";
    });

    setErrors(newErrors);

    // Si hay errores, no enviar el formulario
    if (Object.keys(newErrors).length > 0) return;

    console.log("Formulario enviado:", formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2>Formulario</h2>
      <Input 
        label="Nombre" 
        type="password" 
        placeholder="Escribe tu nombre" 
        name="name"
        onValueChange={handleChange} 
        externalError={errors.name} 
      />
      <Input 
        label="Correo Electrónico" 
        type="email" 
        placeholder="correo@example.com" 
        name="email"
        onValueChange={handleChange} 
        externalError={errors.email} 
      />
      <Button type="submit">Enviar</Button>
    </Form>
  );
};

export default Test;
