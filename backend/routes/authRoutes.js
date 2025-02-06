import express from "express";
import {
    register,
    login,
    logout,
    refreshAccessToken,
    forgotPassword,
    resetPassword
} from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Rutas existentes
router.post("/register", async (req, res) => {
    try {
        const { username, name, surnames, email, password, role } = req.body;
        const result = await register(username, name, surnames, email, password, role);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await login(email, password);
        res.status(200).json(result);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

router.post("/logout", authMiddleware, async (req, res) => {
    try {
        await logout(req.user.id);
        res.status(200).json({ message: "Sesión cerrada exitosamente" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/refresh-token", async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const result = await refreshAccessToken(refreshToken);
        res.status(200).json(result);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

router.get("/profile", authMiddleware, (req, res) => {
    res.json({
        message: "Perfil obtenido correctamente",
        user: req.user,
    });
});

// Solicitud de restablecimiento de contraseña
router.post("/forgot-password", forgotPassword);

// Restablecer contraseña
router.put("/reset-password", resetPassword);

export default router;