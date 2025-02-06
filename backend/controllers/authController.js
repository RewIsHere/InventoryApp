import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import supabase from "../config/db.js";
import { z } from "zod";
import { generateResetToken, sendResetEmail } from "../services/authService.js";
import { resetPasswordSchema } from "../validations/authValidation.js"; // Importamos el esquema de Zod

// Esquemas de validación con Zod
const userSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    name: z.string().min(1, "Name is required"),
    surnames: z.string().min(1, "Surnames are required"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 6 characters long"),
    role: z.enum(["admin", "employee", "superadmin"], "Invalid role").optional(),
});

const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const register = async (username, name, surnames, email, password, role) => {
    // Validar los datos con Zod
    try {
        userSchema.parse({ username, name, surnames, email, password, role });
    } catch (error) {
        throw new Error(error.errors.map(e => e.message).join(", "));
    }

    // Verificar si el username ya está en uso
    const { data: existingUsername, error: usernameError } = await supabase
        .from("users")
        .select("id")
        .eq("username", username)
        .single();

    if (existingUsername) {
        throw new Error("Username is already in use by another user");
    }

    // Verificar si el email ya está en uso
    const { data: existingEmail, error: emailError } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .single();

    if (existingEmail) {
        throw new Error("Email is already in use by another user");
    }

    // Cifrar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el nuevo usuario en la base de datos
    const { data, error } = await supabase
        .from("users")
        .insert([{ username, name, surnames, email, password: hashedPassword, role }])
        .select("*")
        .single();

    if (error) throw new Error(error.message);

    return { message: "User registered successfully", user: data };
};

// Iniciar sesión
export const login = async (email, password) => {
    // Validar los datos con Zod
    try {
        loginSchema.parse({ email, password });
    } catch (error) {
        throw new Error(error.errors.map(e => e.message).join(", "));
    }

    const { data: user, error } = await supabase.from("users").select("*").eq("email", email).single();
    if (error || !user) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    // Generar tokens
    const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_SECRET, { expiresIn: "7d" });

    // Guardar el refresh token en la BD
    await supabase.from("users").update({ refresh_token: refreshToken }).eq("id", user.id);

    return { accessToken, refreshToken, user: { id: user.id, username: user.username, role: user.role } };
};

// Cerrar sesión
export const logout = async (userId) => {
    const { error } = await supabase.from("users").update({ refresh_token: null }).eq("id", userId);
    if (error) throw new Error("Error logging out");
};

// Obtener detalles de un usuario por ID
export const getUserDetails = async (userId) => {
    const { data, error } = await supabase
        .from("users")
        .select("id, username, name, surnames, email, role, is_active, created_at, updated_at")
        .eq("id", userId)
        .single();

    if (error || !data) throw new Error("User not found");
    return data;
};

// Eliminar un usuario por ID
export const deleteUser = async (userId) => {
    // Obtener el usuario antes de eliminarlo
    const { data: user, error } = await supabase
        .from("users")
        .select("id, role")
        .eq("id", userId)
        .single();

    if (error || !user) throw new Error("User not found");

    // Verificar si el usuario es un superadministrador
    if (user.role === "superadmin") {
        throw new Error("Cannot delete the superadmin account");
    }

    // Eliminar el usuario
    const { error: deleteError } = await supabase
        .from("users")
        .delete()
        .eq("id", userId);

    if (deleteError) throw new Error("Error deleting user");
    return { message: "User deleted successfully" };
};

// Desactivar o activar un usuario por ID
export const toggleUserActiveStatus = async (userId, isActive) => {
    // Verificar si el usuario existe
    const { data: user, error: userError } = await supabase
        .from("users")
        .select("id, role, is_active") // Incluimos "is_active" para verificar el estado actual
        .eq("id", userId)
        .single();

    if (userError || !user) {
        throw new Error("User not found");
    }

    // Proteger al superadministrador
    if (user.role === "superadmin") {
        throw new Error("Cannot deactivate the superadmin account");
    }

    // Verificar si el estado ya es el mismo que se intenta establecer
    if (user.is_active === isActive) {
        return { message: `User is already ${isActive ? "active" : "inactive"}` };
    }

    // Actualizar el estado del usuario
    const { error } = await supabase
        .from("users")
        .update({ is_active: isActive })
        .eq("id", userId);

    if (error) throw new Error("Error updating user status");

    return { message: `User ${isActive ? "activated" : "deactivated"} successfully` };
};

// Listar todos los usuarios (solo accesible para admins)
export const listUsers = async (queryParams) => {
    try {
        const { page = 1, limit, role, search, sortBy = "created_at", sortOrder = "desc" } = queryParams;

        // Valores predeterminados y límites
        const DEFAULT_LIMIT = 10;
        const MAX_LIMIT = 20;
        const pageNumber = parseInt(page, 10);
        const limitNumber = Math.min(parseInt(limit, 10) || DEFAULT_LIMIT, MAX_LIMIT);

        if (isNaN(pageNumber) || pageNumber < 1 || isNaN(limitNumber) || limitNumber < 1) {
            throw new Error("Invalid pagination parameters");
        }

        const offset = (pageNumber - 1) * limitNumber;

        // Construir la consulta base
        let query = supabase
            .from("users")
            .select("id, username, name, surnames, email, role, is_active, created_at, updated_at", { count: "exact" });

        // Aplicar filtros
        if (role) {
            query = query.eq("role", role); // Filtrar por rol
        }
        if (search) {
            const searchTerm = `%${search}%`;
            query = query.or(`username.ilike.${searchTerm},email.ilike.${searchTerm},name.ilike.${searchTerm}`);
        }

        // Aplicar ordenamiento
        query = query.order(sortBy, { ascending: sortOrder === "asc" });

        // Aplicar paginación
        query = query.range(offset, offset + limitNumber - 1);

        // Ejecutar la consulta
        const { data, error, count } = await query;

        if (error) throw new Error(error.message);

        return {
            users: data,
            total: count,
            page: pageNumber,
            totalPages: Math.ceil(count / limitNumber),
        };
    } catch (err) {
        throw new Error(err.message);
    }
};

export const updateUserProfile = async (userId, updates) => {
    // Obtener los datos actuales del usuario
    const { data: user, error: userError } = await supabase
        .from("users")
        .select("id, email, username, name, surnames, password")
        .eq("id", userId)
        .single();

    if (userError || !user) {
        throw new Error("User not found");
    }

    // Validar la contraseña actual si se proporciona una nueva contraseña
    if (updates.newPassword && !updates.currentPassword) {
        throw new Error("Current password is required to update the password");
    }

    if (updates.currentPassword && updates.newPassword) {
        const isPasswordValid = await bcrypt.compare(updates.currentPassword, user.password);
        if (!isPasswordValid) {
            throw new Error("Current password is incorrect");
        }

        // Verificar si la nueva contraseña es igual a la actual
        const isNewPasswordSame = await bcrypt.compare(updates.newPassword, user.password);
        if (isNewPasswordSame) {
            throw new Error("New password must be different from the current password");
        }
    }

    // Preparar los datos para la actualización
    const updateData = {};
    const messages = [];

    if (updates.email && updates.email !== user.email) {
        // Verificar que el correo no esté en uso por otro usuario
        const { data: existingUser, error: emailError } = await supabase
            .from("users")
            .select("id")
            .eq("email", updates.email)
            .neq("id", userId)
            .single();
        if (existingUser) {
            throw new Error("Email is already in use by another user");
        }
        updateData.email = updates.email;
    } else if (updates.email) {
        messages.push("Email is already up to date");
    }

    if (updates.username && updates.username !== user.username) {
        // Verificar que el username no esté en uso por otro usuario
        const { data: existingUsername, error: usernameError } = await supabase
            .from("users")
            .select("id")
            .eq("username", updates.username)
            .neq("id", userId)
            .single();
        if (existingUsername) {
            throw new Error("Username is already in use by another user");
        }
        updateData.username = updates.username;
    } else if (updates.username) {
        messages.push("Username is already up to date");
    }

    if (updates.name && updates.name !== user.name) {
        updateData.name = updates.name;
    } else if (updates.name) {
        messages.push("Name is already up to date");
    }

    if (updates.surnames && updates.surnames !== user.surnames) {
        updateData.surnames = updates.surnames;
    } else if (updates.surnames) {
        messages.push("Surnames are already up to date");
    }

    if (updates.newPassword) {
        const hashedPassword = await bcrypt.hash(updates.newPassword, 10);
        updateData.password = hashedPassword;
    }

    // Si no hay cambios, devolver un mensaje
    if (Object.keys(updateData).length === 0 && messages.length > 0) {
        return { message: messages.join(", ") };
    }

    // Si no se proporcionaron campos válidos, lanzar un error
    if (Object.keys(updateData).length === 0 && messages.length === 0) {
        throw new Error("No valid fields provided for update");
    }

    // Actualizar el campo updated_at automáticamente
    updateData.updated_at = new Date().toISOString();

    // Actualizar los detalles del usuario
    const { error } = await supabase
        .from("users")
        .update(updateData)
        .eq("id", userId);

    if (error) throw new Error("Error updating user details");

    return { message: "User details updated successfully" };
};

export const updateUserByAdmin = async (userId, updates) => {
    // Obtener los datos actuales del usuario
    const { data: user, error: userError } = await supabase
        .from("users")
        .select("id, email, role, username, name, surnames, password")
        .eq("id", userId)
        .single();

    if (userError || !user) {
        throw new Error("User not found");
    }

    // Proteger al superadministrador
    if (user.role === "superadmin") {
        if (updates.role && updates.role !== "superadmin") {
            throw new Error("Cannot modify the role of a superadmin account");
        }
    }

    // Preparar los datos para la actualización
    const updateData = {};
    const messages = [];

    if (updates.email && updates.email !== user.email) {
        // Verificar que el correo no esté en uso por otro usuario
        const { data: existingUser, error: emailError } = await supabase
            .from("users")
            .select("id")
            .eq("email", updates.email)
            .neq("id", userId)
            .single();
        if (existingUser) {
            throw new Error("Email is already in use by another user");
        }
        updateData.email = updates.email;
    } else if (updates.email) {
        messages.push("Email is already up to date");
    }

    if (updates.username && updates.username !== user.username) {
        // Verificar que el username no esté en uso por otro usuario
        const { data: existingUsername, error: usernameError } = await supabase
            .from("users")
            .select("id")
            .eq("username", updates.username)
            .neq("id", userId)
            .single();
        if (existingUsername) {
            throw new Error("Username is already in use by another user");
        }
        updateData.username = updates.username;
    } else if (updates.username) {
        messages.push("Username is already up to date");
    }

    if (updates.name && updates.name !== user.name) {
        updateData.name = updates.name;
    } else if (updates.name) {
        messages.push("Name is already up to date");
    }

    if (updates.surnames && updates.surnames !== user.surnames) {
        updateData.surnames = updates.surnames;
    } else if (updates.surnames) {
        messages.push("Surnames are already up to date");
    }

    if (updates.role && updates.role !== user.role) {
        // Verificar que el nuevo rol sea válido
        const validRoles = ["admin", "employee", "superadmin"];
        if (!validRoles.includes(updates.role)) {
            throw new Error("Invalid role provided");
        }
        updateData.role = updates.role;
    } else if (updates.role) {
        messages.push("Role is already up to date");
    }

    if (updates.password) {
        // Verificar si la nueva contraseña es igual a la actual
        const isNewPasswordSame = await bcrypt.compare(updates.password, user.password);
        if (isNewPasswordSame) {
            messages.push("Password is already up to date");
        } else {
            const hashedPassword = await bcrypt.hash(updates.password, 10);
            updateData.password = hashedPassword;
        }
    }

    // Si no hay cambios, devolver un mensaje
    if (Object.keys(updateData).length === 0 && messages.length > 0) {
        return { message: messages.join(", ") };
    }

    // Si no se proporcionaron campos válidos, lanzar un error
    if (Object.keys(updateData).length === 0 && messages.length === 0) {
        throw new Error("No valid fields provided for update");
    }

    // Actualizar el campo updated_at automáticamente
    updateData.updated_at = new Date().toISOString();

    // Actualizar los detalles del usuario
    const { error } = await supabase
        .from("users")
        .update(updateData)
        .eq("id", userId);

    if (error) throw new Error("Error updating user details");

    return { message: "User details updated successfully" };
};

// Refrescar el token de acceso
export const refreshAccessToken = async (refreshToken) => {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const { data, error } = await supabase.from("users").select("id, role, refresh_token").eq("id", decoded.id).single();
    
    if (error || !data || data.refresh_token !== refreshToken) {
        throw new Error("Invalid or expired refresh token");
    }

    // Generar nuevos tokens
    const newAccessToken = jwt.sign({ id: data.id, role: data.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const newRefreshToken = jwt.sign({ id: data.id }, process.env.REFRESH_SECRET, { expiresIn: "7d" });

    // Guardar el nuevo refresh token en la BD
    await supabase.from("users").update({ refresh_token: newRefreshToken }).eq("id", data.id);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

// Solicitar restablecimiento de contraseña
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Validar el correo electrónico
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        // Verificar si el usuario existe
        const { data: user, error: userError } = await supabase
            .from("users")
            .select("id, email")
            .eq("email", email)
            .single();

        if (userError || !user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Generar token único
        const resetToken = generateResetToken(user.id);

        // Construir el enlace de restablecimiento
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        // Enviar correo electrónico
        await sendResetEmail(user.email, resetLink);

        res.status(200).json({ message: "Password reset link sent to your email" });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while processing your request" });
    }
};

// Restablecer contraseña
export const resetPassword = async (req, res) => {
    try {
        // Validar los datos con Zod
        const validatedData = resetPasswordSchema.parse(req.body);
        const { token, newPassword } = validatedData;

        // Verificar el token
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.RESET_PASSWORD_SECRET);
        } catch (error) {
            return res.status(400).json({ error: "Invalid or expired token" });
        }

        const userId = decodedToken.userId;

        // Obtener los datos actuales del usuario
        const { data: user, error: userError } = await supabase
            .from("users")
            .select("password")
            .eq("id", userId)
            .single();

        if (userError || !user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Verificar si la nueva contraseña es igual a la actual
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({ error: "New password must be different from the current password" });
        }

        // Cifrar la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Actualizar la contraseña y el campo updated_at en la base de datos
        const { error } = await supabase
            .from("users")
            .update({
                password: hashedPassword,
                updated_at: new Date().toISOString(), // Actualizamos el campo updated_at
            })
            .eq("id", userId);

        if (error) {
            throw new Error("Error updating password");
        }

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors.map(e => e.message).join(", ") });
        }
        res.status(500).json({ error: "An error occurred while processing your request" });
    }
};