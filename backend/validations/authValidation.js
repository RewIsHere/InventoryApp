import { z } from "zod";

// Esquema de validación para la nueva contraseña
export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: z
    .string()
    .min(8, "La contraseña debe ser minimo de 8 caracteres")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
      "La contraseña debe incluir, numeros, letras y caracteres especiales"
    )
    .refine(
      (value) => !/\s/.test(value),
      "La contraseña no puede tener espacios"
    ),
});

// Esquema de validación para registro
export const validateRegister = (data) => {
  const schema = z.object({
    username: z
      .string()
      .min(3, "El nombre de usuario debe ser de minimo 3 caracteres"),
    name: z.string().min(1, "El nombre es requerido"),
    surnames: z.string().min(1, "Los apellidos son requeridos"),
    email: z.string().email("Formato de correo invalido"),
    password: z
      .string()
      .min(8, "La contraseña debe ser minimo de 8 caracteres")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
        "La contraseña debe incluir, numeros, letras y caracteres especiales"
      )
      .refine(
        (value) => !/\s/.test(value),
        "La contraseña no puede tener espacios"
      ),
    role: z.enum(["admin", "employee", "superadmin"]).optional(),
  });

  return schema.parse(data);
};

// Esquema de validación para inicio de sesión
export const validateLogin = (data) => {
  const schema = z.object({
    email: z.string().email("Invalid email format"),
    password: z
      .string()
      .min(8, "La contraseña debe ser minimo de 8 caracteres")
      .refine(
        (value) => !/\s/.test(value),
        "La contraseña no puede tener espacios"
      ),
  });
  return schema.parse(data);
};
