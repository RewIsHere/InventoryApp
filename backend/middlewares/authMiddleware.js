import jwt from "jsonwebtoken";
import supabase from "../config/db.js";

// Middleware para verificar el token JWT
export const authMiddleware = async (req, res, next) => {
    try {
        // Verificamos si el token está en la cabecera Authorization
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: "Authorization token missing" });
        }

        // Verificar el token con la clave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // Guardamos el usuario en la request
        return next();

    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token expired, please refresh it" });
        }
        return res.status(401).json({ error: "Invalid token" });
    }
};

// Middleware opcional para manejar refresh tokens automáticamente (si lo quieres)
export const refreshTokenMiddleware = async (req, res, next) => {
    try {
        const refreshToken = req.header("x-refresh-token");
        if (!refreshToken) {
            return res.status(401).json({ error: "Refresh token missing" });
        }

        // Verificar si el refresh token es válido
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

        // Buscar al usuario en la base de datos con el refresh token
        const { data, error } = await supabase
            .from("users")
            .select("id, role, refresh_token")
            .eq("id", decoded.id)
            .eq("refresh_token", refreshToken)
            .single();

        if (error || !data) {
            return res.status(401).json({ error: "Invalid or expired refresh token" });
        }

        // Generar nuevos tokens
        const newAccessToken = jwt.sign({ id: data.id, role: data.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
        const newRefreshToken = jwt.sign({ id: data.id }, process.env.REFRESH_SECRET, { expiresIn: "7d" });

        // Guardar el nuevo refresh token en la base de datos
        await supabase
            .from("users")
            .update({ refresh_token: newRefreshToken })
            .eq("id", data.id);

        // Enviar los nuevos tokens en la respuesta
        res.setHeader("x-access-token", newAccessToken);
        res.setHeader("x-refresh-token", newRefreshToken);
        req.user = { id: data.id, role: data.role };
        next();

    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired refresh token" });
    }
};
