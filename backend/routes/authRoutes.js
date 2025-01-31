import express from "express";
import { register, login, logout, refreshAccessToken } from "../controllers/authController.js";
import { authMiddleware, refreshTokenMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post("/register", async (req, res) => {
    try {
        const { username, name, surnames, email, password, role } = req.body;
        const result = await register(username, name, surnames, email, password, role);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Ruta para iniciar sesión
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await login(email, password);
        res.status(200).json(result);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

// Ruta para cerrar sesión
router.post("/logout", authMiddleware, async (req, res) => {
    try {
        await logout(req.user.id);
        res.status(200).json({ message: "Sesión cerrada exitosamente" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Ruta para refrescar el token
router.post("/refresh-token", async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const result = await refreshAccessToken(refreshToken);
        res.status(200).json(result);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

// Ruta para obtener el perfil con autenticación y posible refresh automático
router.get("/profile", async (req, res, next) => {
    try {
        await authMiddleware(req, res, next);
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return refreshTokenMiddleware(req, res, next);
        }
        return res.status(401).json({ error: "Invalid token" });
    }
}, (req, res) => {
    res.json({
        message: "Perfil obtenido correctamente",
        user: req.user,
    });
});

export default router;
