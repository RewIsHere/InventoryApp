import express from "express";
import {
    register,
    login,
    logout,
    refreshAccessToken,
    getProfile,
    forgotPassword,
    resetPassword
} from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Registro de usuario
router.post("/register", register);

// Inicio de sesión
router.post("/login", login);

// Cerrar sesión
router.post("/logout", authMiddleware, logout);

// Refrescar token
router.post("/refresh-token", refreshAccessToken);

// Obtener perfil
router.get("/profile", authMiddleware, getProfile);

// Solicitud de restablecimiento de contraseña
router.post("/forgot-password", forgotPassword);

// Restablecer contraseña
router.put("/reset-password", resetPassword);

export default router;