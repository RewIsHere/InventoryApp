import { z } from "zod";

// Esquema de validación para actualizar el perfil
export const validateProfileUpdate = (data) => {
  const schema = z.object({
    currentPassword: z
      .string()
      .min(8, "Current password is required")
      .optional(),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
        "Password must include letters, numbers, and special characters"
      )
      .refine((value) => !/\s/.test(value), "Password cannot contain spaces")
      .optional(),
    email: z.string().email("Invalid email format").optional(),
    name: z.string().min(1, "Name is required").optional(),
    surnames: z.string().min(1, "Surnames are required").optional(),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .refine(
        (value) => /^[a-zA-Z0-9_-]+$/.test(value),
        "Username can only contain letters, numbers, underscores (_), and hyphens (-)"
      )
      .optional(),
  });

  return schema.parse(data);
};

// Esquema de validación para actualizar un usuario como administrador
export const validateAdminUpdate = (data) => {
  const schema = z.object({
    email: z.string().email("Invalid email format").optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
        "La contraseña debe incluir, numeros, letras y caracteres especiales"
      )
      .refine(
        (value) => !/\s/.test(value),
        "La contraseña debe ser minimo de 8 caracteres"
      )
      .optional(),
    name: z.string().min(1, "El nombre es requerido").optional(),
    surnames: z.string().min(1, "Los apellidos son requeridos").optional(),
    role: z.enum(["admin", "employee", "superadmin"]).optional(),
    username: z
      .string()
      .min(3, "El nombre de usuario debe ser de minimo 3 caracteres")
      .refine(
        (value) => /^[a-zA-Z0-9_-]+$/.test(value),
        "El nombre de usuario solo puede contener letras, números, guiones bajos (_) y guiones (-)"
      )
      .optional(),
  });

  return schema.parse(data);
};

// Esquema de validación para los parámetros de consulta de listUsers
export const validateListUsersQuery = (queryParams) => {
  const schema = z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    role: z.enum(["admin", "employee", "superadmin"]).optional(),
    search: z.string().optional(),
    sort: z.string().optional(), // Aceptar `sort=campo_orden`
  });

  const validated = schema.parse(queryParams);

  // 🔍 Descomponer `sort` si está presente
  if (validated.sort) {
    const [sortBy, sortOrder] = validated.sort.split("_");

    // Verificar que `sortBy` y `sortOrder` sean válidos
    if (
      ![
        "id",
        "username",
        "name",
        "surnames",
        "email",
        "role",
        "is_active",
        "created_at",
        "updated_at",
      ].includes(sortBy)
    ) {
      throw new Error("Invalid sortBy field");
    }
    if (!["asc", "desc"].includes(sortOrder)) {
      throw new Error("Invalid sortOrder value");
    }

    // ✅ Retornar `sortBy` y `sortOrder` correctamente
    return {
      ...validated, // Mantener los valores ya validados
      sortBy,
      sortOrder,
    };
  }

  return validated;
};

// Esquema de validación para el ID de usuario
export const validateUserId = (id) => {
  const schema = z.string().uuid("Invalid user ID: Must be a valid UUID");
  return schema.parse(id);
};

// Esquema de validación para el cuerpo de la solicitud (toggle-active)
export const validateToggleActiveBody = (body) => {
  const schema = z.object({
    isActive: z.boolean({
      required_error: "isActive is required and must be a boolean",
      invalid_type_error: "isActive must be a boolean",
    }),
  });
  return schema.parse(body);
};
