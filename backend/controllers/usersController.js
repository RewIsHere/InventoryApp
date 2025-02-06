import bcrypt from "bcryptjs";
import supabase from "../config/db.js";

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