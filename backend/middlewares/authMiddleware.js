import jwt from "jsonwebtoken";

// Middleware para verificar el token JWT
export const authMiddleware = (req, res, next) => {
    // Verificamos si el token está en la cabecera Authorization
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Authorization token missing' });
    }

    try {
        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // Guardamos el payload del JWT (usuario) en la solicitud
        next();  // Continuamos con la ejecución de la solicitud
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};