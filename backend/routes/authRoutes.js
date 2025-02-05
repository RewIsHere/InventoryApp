import express from "express";
import {
    register,
    login,
    logout,
    refreshAccessToken,
    getUserDetails,
    deleteUser,
    toggleUserActiveStatus,
    listUsers,
    updateUserDetails
} from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { validateToggleActiveBody } from "../middlewares/validateToggleActiveBody.js";
import { z } from "zod";

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

// Actualizar los detalles del usuario (el usuario que inició sesión)
// Actualizar los detalles del usuario (el usuario que inició sesión)
router.patch("/profile", authMiddleware, async (req, res) => {
    try {
        // Verificar si el body está vacío
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: "No data provided for update" });
        }

        const userId = req.user.id; // ID del usuario autenticado
        const { currentPassword, newPassword, email, name, surnames, username } = req.body;

        // Validar los datos con Zod
        const updateSchema = z.object({
            currentPassword: z.string().min(6, "Current password is required").optional(),
            newPassword: z.string().min(6, "New password must be at least 6 characters long").optional(),
            email: z.string().email("Invalid email format").optional(),
            name: z.string().min(1, "Name is required").optional(),
            surnames: z.string().min(1, "Surnames are required").optional(),
            username: z.string().min(3, "Username must be at least 3 characters long").optional(),
        });

        try {
            updateSchema.parse(req.body);
        } catch (error) {
            return res.status(400).json({ error: error.errors.map(e => e.message).join(", ") });
        }

        // Llamar a la función para actualizar los detalles del usuario
        const result = await updateUserDetails(userId, {
            currentPassword,
            newPassword,
            email,
            name,
            surnames,
            username,
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(error.message === "User not found" ? 404 : 500).json({ error: error.message });
    }
});

// Actualizar los detalles de un usuario siendo administrador
router.patch("/users/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        // Verificar si el body está vacío
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: "No data provided for update" });
        }

        const userId = req.params.id;
        const { email, password, name, surnames, role, username } = req.body;

        // Validar los datos con Zod
        const updateSchema = z.object({
            email: z.string().email("Invalid email format").optional(),
            password: z.string().min(6, "Password must be at least 6 characters long").optional(),
            name: z.string().min(1, "Name is required").optional(),
            surnames: z.string().min(1, "Surnames are required").optional(),
            role: z.enum(["admin", "employee", "superadmin"]).optional(),
            username: z.string().min(3, "Username must be at least 3 characters long").optional(),
        });

        try {
            updateSchema.parse(req.body);
        } catch (error) {
            return res.status(400).json({ error: error.errors.map(e => e.message).join(", ") });
        }

        // Llamar a la función para actualizar los detalles del usuario
        const result = await updateUserDetails(userId, { email, password, name, surnames, role, username });

        // Si no hay cambios, devolver un mensaje específico
        if (result.message.includes("up to date")) {
            return res.status(200).json({ message: result.message });
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(error.message === "User not found" ? 404 : 500).json({ error: error.message });
    }
});

// Ruta para listar usuarios con paginación, filtros y ordenamiento
router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        // Extraer query parameters
        const queryParams = {
            page: req.query.page, // Página actual (opcional)
            limit: req.query.limit, // Número de resultados por página (opcional)
            role: req.query.role, // Filtrar por rol (opcional)
            search: req.query.search, // Búsqueda por username, email o name (opcional)
            sortBy: req.query.sortBy, // Campo por el que se ordena (opcional)
            sortOrder: req.query.sortOrder, // Orden ascendente/descendente (opcional)
        };

        // Llamar a la función listUsers con los parámetros
        const result = await listUsers(queryParams);

        // Devolver la respuesta al cliente
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener los detalles de un usuario especifo
router.get("/users/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const userId = req.params.id;
        const userDetails = await getUserDetails(userId);
        res.status(200).json(userDetails);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Eliminar la cuenta de un usuario
router.delete("/users/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const userId = req.params.id;
        const result = await deleteUser(userId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Activar o desactivar la cuenta de un usuario
router.patch("/users/:id/toggle-active", authMiddleware, adminMiddleware, validateToggleActiveBody, async (req, res) => {
    try {
        const userId = req.params.id;
        const { isActive } = req.body; // true para activar, false para desactivar
        const result = await toggleUserActiveStatus(userId, isActive);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.message === "User not found" ? 404 : 500).json({ error: error.message });
    }
});

export default router;