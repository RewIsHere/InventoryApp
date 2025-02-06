import express from "express";
import {
    getUserDetails,
    deleteUser,
    toggleUserActiveStatus,
    listUsers,
    updateProfile,
    updateUserByAdmin,
} from "../controllers/usersController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { validateRequestBodyMiddleware } from "../middlewares/validateRequestBodyMiddleware.js";

const router = express.Router();

// Actualizar los detalles del perfil del usuario autenticado
router.patch("/profile", authMiddleware, validateRequestBodyMiddleware(["currentPassword", "newPassword", "email", "name", "surnames", "username"]), updateProfile);

// Actualizar los detalles de un usuario siendo administrador
router.patch("/:id", authMiddleware, adminMiddleware, validateRequestBodyMiddleware(["email", "password", "name", "surnames", "role", "username"]), updateUserByAdmin);

// Listar usuarios con paginación, filtros y ordenamiento
router.get("/", authMiddleware, adminMiddleware, listUsers);

// Obtener detalles de un usuario específico
router.get("/:id", authMiddleware, adminMiddleware, getUserDetails);

// Eliminar un usuario por ID
router.delete("/:id", authMiddleware, adminMiddleware, deleteUser);

// Activar o desactivar la cuenta de un usuario
router.patch("/:id/toggle-active", authMiddleware, adminMiddleware, validateRequestBodyMiddleware(["isActive"]), toggleUserActiveStatus);

export default router;