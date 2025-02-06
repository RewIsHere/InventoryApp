import { z } from "zod";

// Esquema de validación para la nueva contraseña
export const resetPasswordSchema = z.object({
    token: z.string().min(1, "Token is required"),
    newPassword: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/, "Password must include letters, numbers, and special characters")
        .refine(value => !/\s/.test(value), "Password cannot contain spaces"),
});

// Esquema de validación para registro
export const validateRegister = (data) => {
    const schema = z.object({
        username: z.string().min(3, "Username must be at least 3 characters long"),
        name: z.string().min(1, "Name is required"),
        surnames: z.string().min(1, "Surnames are required"),
        email: z.string().email("Invalid email format"),
        password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/, "Password must include letters, numbers, and special characters")
        .refine(value => !/\s/.test(value), "Password cannot contain spaces"),
        role: z.enum(["admin", "employee", "superadmin"]).optional(),
    });

    return schema.parse(data);
};

// Esquema de validación para inicio de sesión
export const validateLogin = (data) => {
    const schema = z.object({
        email: z.string().email("Invalid email format"),
        password: z.string()
            .min(8, "Password must be at least 8 characters long")
            .refine(value => !/\s/.test(value), "Password cannot contain spaces"),
    });
    return schema.parse(data);
};