import { validateRequestBody } from "../utils/requestValidationUtils.js";

// Middleware genérico para validar el cuerpo de la solicitud
export const validateRequestBodyMiddleware = (allowedFields) => {
    return (req, res, next) => {
        try {
            // Validar el cuerpo de la solicitud
            validateRequestBody(req.body, allowedFields);
            next();
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    };
};