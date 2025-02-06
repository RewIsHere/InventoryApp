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
import { validateRequestBodyMiddleware } from "../middlewares/validateRequestBodyMiddleware.js";

const router = express.Router();

// Registro de usuario
router.post(
    "/register",
    validateRequestBodyMiddleware(["username", "name", "surnames", "email", "password", "role"]),
    register
);
// Inicio de sesión
router.post(
    "/login",
    validateRequestBodyMiddleware(["email", "password"]),
    login
);

// Cerrar sesión
router.post("/logout", authMiddleware, logout);

// Refrescar token
router.post(
    "/refresh-token",
    validateRequestBodyMiddleware(["refreshToken"]),
    refreshAccessToken
);
// Obtener perfil
router.get("/profile", authMiddleware, getProfile);

// Solicitud de restablecimiento de contraseña
router.post(
    "/forgot-password",
    validateRequestBodyMiddleware(["email"]),
    forgotPassword
);

// Restablecer contraseña
router.put(
    "/reset-password",
    validateRequestBodyMiddleware(["token", "newPassword"]),
    resetPassword
);
export default router;