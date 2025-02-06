import { z } from "zod";

// Esquema de validación para la nueva contraseña
export const resetPasswordSchema = z.object({
    token: z.string().min(1, "Token is required"),
    newPassword: z
        .string()
        .min(8, "Password must be at least 6 characters long")
        .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/, "Password must include letters and numbers")
        .refine(value => !/\s/.test(value), "Password cannot contain spaces"),
});