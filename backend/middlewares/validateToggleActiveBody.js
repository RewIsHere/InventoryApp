import { validateToggleActiveBody } from "../validations/userValidation.js";

// Middleware para validar el cuerpo de la solicitud (toggle-active)
export const validateToggleActiveBody = (req, res, next) => {
    try {
        req.body = validateToggleActiveBody(req.body);
        next();
    } catch (error) {
        return res.status(400).json({ error: error.errors.map(e => e.message).join(", ") });
    }
};