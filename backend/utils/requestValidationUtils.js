// Función para validar el cuerpo de la solicitud
export const validateRequestBody = (body, allowedFields) => {
    // 1. Verificar si el body está vacío
    if (Object.keys(body).length === 0) {
        throw new Error("Request body cannot be empty");
    }

    // 2. Verificar si hay campos no permitidos
    const invalidFields = Object.keys(body).filter(field => !allowedFields.includes(field));
    if (invalidFields.length > 0) {
        throw new Error(`Invalid fields in request body: ${invalidFields.join(", ")}`);
    }
};