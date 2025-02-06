import { z } from "zod";

// Esquema de validación para actualizar el perfil
export const validateProfileUpdate = (data) => {
    const schema = z.object({
        currentPassword: z.string().min(8, "Current password is required").optional(),
        newPassword: z.string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/, "Password must include letters, numbers, and special characters")
        .refine(value => !/\s/.test(value), "Password cannot contain spaces").optional(),
        email: z.string().email("Invalid email format").optional(),
        name: z.string().min(1, "Name is required").optional(),
        surnames: z.string().min(1, "Surnames are required").optional(),
        username: z
            .string()
            .min(3, "Username must be at least 3 characters long")
            .refine(
                value => /^[a-zA-Z0-9_-]+$/.test(value),
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
        password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/, "Password must include letters, numbers, and special characters")
        .refine(value => !/\s/.test(value), "Password cannot contain spaces").optional(),
        name: z.string().min(1, "Name is required").optional(),
        surnames: z.string().min(1, "Surnames are required").optional(),
        role: z.enum(["admin", "employee", "superadmin"]).optional(),
        username: z
            .string()
            .min(3, "Username must be at least 3 characters long")
            .refine(
                value => /^[a-zA-Z0-9_-]+$/.test(value),
                "Username can only contain letters, numbers, underscores (_), and hyphens (-)"
            )
            .optional(),
    });

    return schema.parse(data);
};

// Esquema de validación para los parámetros de consulta de listUsers
export const validateListUsersQuery = (queryParams) => {
    const schema = z.object({
        page: z.string().optional(), // Página actual (opcional)
        limit: z.string().optional(), // Número de resultados por página (opcional)
        role: z.enum(["admin", "employee", "superadmin"]).optional(), // Rol (opcional)
        search: z.string().optional(), // Búsqueda por username, email o name (opcional)
        sortBy: z
            .string()
            .refine(
                value => ["id", "username", "name", "surnames", "email", "role", "is_active", "created_at", "updated_at"].includes(value),
                "Invalid sortBy field"
            )
            .optional(), // Campo por el que se ordena (opcional)
        sortOrder: z.enum(["asc", "desc"]).optional(), // Orden ascendente/descendente (opcional)
    });

    return schema.parse(queryParams);
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