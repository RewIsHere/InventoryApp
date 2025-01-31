import express from "express";
import { register, login, logout, refreshAccessToken } from "../controllers/authController.js";
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post("/register", async (req, res) => {
    try {
        const { username, name, surnames ,email, password, role } = req.body;
        const result = await register(username, name, surnames ,email, password, role);
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
router.post("/logout", async (req, res) => {
    try {
        const { userId } = req.body;
        await logout(userId);
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

router.get('/profile', authMiddleware, (req, res) => {
    res.json(req.user); // Aquí deberías devolver los detalles del usuario si la autenticación fue exitosa
});

export default router;
