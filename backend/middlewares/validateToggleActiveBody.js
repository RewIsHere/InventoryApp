import { z } from "zod";

// Esquema de validación para el body
const toggleActiveSchema = z.object({
    isActive: z.boolean({
        required_error: "isActive is required and must be a boolean",
    }),
});

// Middleware para validar el body
export const validateToggleActiveBody = (req, res, next) => {
    try {
        // Validar el body con Zod
        toggleActiveSchema.parse(req.body);
        next(); // Continuar si la validación es exitosa
    } catch (error) {
        // Devolver un error 400 con los mensajes de validación
        return res.status(400).json({ error: error.errors.map(e => e.message).join(", ") });
    }
};