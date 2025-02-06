import { updateUserProfileService, updateUserByAdminService, listUsersService, getUserDetailsService, deleteUserService, toggleUserActiveStatusService } from "../services/userService.js";
import { ZodError } from "zod";

// Obtener detalles de un usuario por ID
export const getUserDetails = async (req, res) => {
    try {
        const userId = req.params.id;
        const userDetails = await getUserDetailsService(userId);
        res.status(200).json(userDetails);
    } catch (error) {
        if (error.message === "User not found") {
            return res.status(404).json({ error: "User not found" });
        }
        if (error instanceof ZodError) {
            return res.status(400).json({ error: error.errors.map(e => e.message).join(", ") });
        }
        res.status(500).json({ error: "An error occurred while processing your request" });
    }
};

// Eliminar un usuario por ID
export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const result = await deleteUserService(userId);
        res.status(200).json(result);
    } catch (error) {
        if (error.message === "User not found") {
            return res.status(404).json({ error: "User not found" });
        }
        if (error.message === "Cannot delete the superadmin account") {
            return res.status(403).json({ error: "Cannot delete the superadmin account" });
        }
        if (error instanceof ZodError) {
            return res.status(400).json({ error: error.errors.map(e => e.message).join(", ") });
        }
        res.status(500).json({ error: "An error occurred while processing your request" });
    }
};

// Activar o desactivar un usuario por ID
export const toggleUserActiveStatus = async (req, res) => {
    try {
        const userId = req.params.id;
        const { isActive } = req.body; // true para activar, false para desactivar
        const result = await toggleUserActiveStatusService(userId, isActive);
        res.status(200).json(result);
    } catch (error) {
        if (error.message === "User not found") {
            return res.status(404).json({ error: "User not found" });
        }
        if (error.message === "Cannot deactivate the superadmin account") {
            return res.status(403).json({ error: "Cannot deactivate the superadmin account" });
        }
        if (error instanceof ZodError) {
            return res.status(400).json({ error: error.errors.map(e => e.message).join(", ") });
        }
        res.status(500).json({ error: "An error occurred while processing your request" });
    }
};

// Listar usuarios
export const listUsers = async (req, res) => {
    try {
        // Extraer query parameters
        const queryParams = {
            page: req.query.page,
            limit: req.query.limit,
            role: req.query.role,
            search: req.query.search,
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder,
        };
        // Llamar al servicio para listar usuarios
        const result = await listUsersService(queryParams);
        // Devolver la respuesta al cliente
        res.status(200).json(result);
    } catch (error) {
        if (error.message === "Invalid pagination parameters") {
            return res.status(400).json({ error: "Invalid pagination parameters" });
        }
        if (error instanceof ZodError) {
            return res.status(400).json({ error: error.errors.map(e => e.message).join(", ") });
        }
        res.status(500).json({ error: "An error occurred while processing your request" });
    }
};

// Actualizar perfil del usuario
export const updateProfile = async (req, res) => {
    try {
        // Verificar si el body está vacío
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: "No data provided for update" });
        }
        const userId = req.user.id;
        const result = await updateUserProfileService(userId, req.body);
        res.status(200).json(result);
    } catch (error) {
        if (error.message === "User not found") {
            return res.status(404).json({ error: "User not found" });
        }
        if (error.message === "Current password is required to update the password") {
            return res.status(400).json({ error: "Current password is required to update the password" });
        }
        if (error.message === "Current password is incorrect") {
            return res.status(400).json({ error: "Current password is incorrect" });
        }
        if (error.message === "New password must be different from the current password") {
            return res.status(400).json({ error: "New password must be different from the current password" });
        }
        if (error instanceof ZodError) {
            return res.status(400).json({ error: error.errors.map(e => e.message).join(", ") });
        }
        res.status(500).json({ error: "An error occurred while processing your request" });
    }
};

// Actualizar detalles de un usuario por parte del administrador
export const updateUserByAdmin = async (req, res) => {
    try {
        // Verificar si el body está vacío
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: "No data provided for update" });
        }
        const userId = req.params.id;
        const result = await updateUserByAdminService(userId, req.body);
        res.status(200).json(result);
    } catch (error) {
        if (error.message === "User not found") {
            return res.status(404).json({ error: "User not found" });
        }
        if (error.message === "Cannot modify the role of a superadmin account") {
            return res.status(403).json({ error: "Cannot modify the role of a superadmin account" });
        }
        if (error.message === "Invalid role provided") {
            return res.status(400).json({ error: "Invalid role provided" });
        }
        if (error instanceof ZodError) {
            return res.status(400).json({ error: error.errors.map(e => e.message).join(", ") });
        }
        res.status(500).json({ error: "An error occurred while processing your request" });
    }
};