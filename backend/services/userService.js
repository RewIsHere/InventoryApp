import bcrypt from "bcryptjs";
import supabase from "../config/db.js";
import {
  validateProfileUpdate,
  validateAdminUpdate,
  validateListUsersQuery,
  validateUserId,
} from "../validations/userValidation.js";
import { isUsernameValid } from "../utils/validationUtils.js";

// Actualizar perfil del usuario
export const updateUserProfileService = async (userId, updates) => {
  // Validar los datos con Zod
  const validatedData = validateProfileUpdate(updates);

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
  if (validatedData.newPassword && !validatedData.currentPassword) {
    throw new Error("Current password is required to update the password");
  }
  if (validatedData.currentPassword && validatedData.newPassword) {
    const isPasswordValid = await bcrypt.compare(
      validatedData.currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      throw new Error("Current password is incorrect");
    }
    // Verificar si la nueva contraseña es igual a la actual
    const isNewPasswordSame = await bcrypt.compare(
      validatedData.newPassword,
      user.password
    );
    if (isNewPasswordSame) {
      throw new Error(
        "New password must be different from the current password"
      );
    }
  }

  // Preparar los datos para la actualización
  const updateData = {};

  if (validatedData.email && validatedData.email !== user.email) {
    // Verificar que el correo no esté en uso por otro usuario
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", validatedData.email)
      .neq("id", userId)
      .single();
    if (existingUser) {
      throw new Error("Email is already in use by another user");
    }
    updateData.email = validatedData.email;
  } else if (validatedData.email) {
    throw new Error("Email is already up to date");
  }

  if (validatedData.username && validatedData.username !== user.username) {
    // Verificar formato del username
    if (!isUsernameValid(validatedData.username)) {
      throw new Error(
        "Username can only contain letters, numbers, underscores (_), and hyphens (-)"
      );
    }
    // Verificar que el username no esté en uso por otro usuario
    const { data: existingUsername } = await supabase
      .from("users")
      .select("id")
      .eq("username", validatedData.username)
      .neq("id", userId)
      .single();
    if (existingUsername) {
      throw new Error("Username is already in use by another user");
    }
    updateData.username = validatedData.username;
  } else if (validatedData.username) {
    throw new Error("Username is already up to date");
  }

  if (validatedData.name && validatedData.name !== user.name) {
    updateData.name = validatedData.name;
  } else if (validatedData.name) {
    throw new Error("Name is already up to date");
  }

  if (validatedData.surnames && validatedData.surnames !== user.surnames) {
    updateData.surnames = validatedData.surnames;
  } else if (validatedData.surnames) {
    throw new Error("Surnames are already up to date");
  }

  if (validatedData.newPassword) {
    const hashedPassword = await bcrypt.hash(validatedData.newPassword, 10);
    updateData.password = hashedPassword;
  }

  // Si no hay cambios, lanzar un error
  if (Object.keys(updateData).length === 0) {
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

// Actualizar detalles de un usuario por parte del administrador
export const updateUserByAdminService = async (userId, updates) => {
  // Validar los datos con Zod
  const validatedData = validateAdminUpdate(updates);

  // Obtener los datos actuales del usuario
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id, email, role, username, name, surnames, password")
    .eq("id", userId)
    .single();

  if (userError || !user) {
    throw new Error("Usuario no encontrado");
  }

  // Proteger al superadministrador
  if (user.role === "superadmin") {
    if (validatedData.role && validatedData.role !== "superadmin") {
      throw new Error("No puedes modificar el rol de un superadmin");
    }
  }

  // Preparar los datos para la actualización
  const updateData = {};

  if (validatedData.email && validatedData.email !== user.email) {
    // Verificar que el correo no esté en uso por otro usuario
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", validatedData.email)
      .neq("id", userId)
      .single();
    if (existingUser) {
      throw new Error("El correo ya esta en uso por otro usuario");
    }
    updateData.email = validatedData.email;
  } else if (validatedData.email) {
    throw new Error("Email ya esta al dia");
  }

  if (validatedData.username && validatedData.username !== user.username) {
    // Verificar formato del username
    if (!isUsernameValid(validatedData.username)) {
      throw new Error(
        "El nombre de usuario solo puede contener letras, números, guiones bajos (_) y guiones (-)"
      );
    }
    // Verificar que el username no esté en uso por otro usuario
    const { data: existingUsername } = await supabase
      .from("users")
      .select("id")
      .eq("username", validatedData.username)
      .neq("id", userId)
      .single();
    if (existingUsername) {
      throw new Error("El nombre de usuario ya esta en uso");
    }
    updateData.username = validatedData.username;
  } else if (validatedData.username) {
    throw new Error("El nombre de usuario esta al dia");
  }

  if (validatedData.name && validatedData.name !== user.name) {
    updateData.name = validatedData.name;
  } else if (validatedData.name) {
    throw new Error("Nombre esta al dia");
  }

  if (validatedData.surnames && validatedData.surnames !== user.surnames) {
    updateData.surnames = validatedData.surnames;
  } else if (validatedData.surnames) {
    throw new Error("Apellidos esta al dia");
  }

  if (validatedData.role && validatedData.role !== user.role) {
    // Verificar que el nuevo rol sea válido
    const validRoles = ["admin", "employee", "superadmin"];
    if (!validRoles.includes(validatedData.role)) {
      throw new Error("Se dio un rol invalido");
    }
    updateData.role = validatedData.role;
  } else if (validatedData.role) {
    throw new Error("El rol esta al dia");
  }

  if (validatedData.password) {
    // Verificar si la nueva contraseña es igual a la actual
    const isNewPasswordSame = await bcrypt.compare(
      validatedData.password,
      user.password
    );
    if (isNewPasswordSame) {
      throw new Error("La contraseña esta al dia");
    } else {
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      updateData.password = hashedPassword;
    }
  }

  // Si no hay cambios, lanzar un error
  if (Object.keys(updateData).length === 0) {
    throw new Error("No hay campos validos para actualizar");
  }

  // Actualizar el campo updated_at automáticamente
  updateData.updated_at = new Date().toISOString();

  // Actualizar los detalles del usuario
  const { error } = await supabase
    .from("users")
    .update(updateData)
    .eq("id", userId);

  if (error) throw new Error("Error al actualizar el usuario");

  return { message: "Detalles del usuario actualizados correctamente" };
};

export const listUsersService = async (queryParams) => {
  console.log("🔍 Parámetros recibidos:", queryParams);

  const validatedParams = validateListUsersQuery(queryParams);
  console.log("✅ Parámetros validados:", validatedParams);

  const {
    page = 1,
    limit = 10,
    role,
    search,
    sort = "created_at_desc", // Recibe `sort` en vez de `sortBy` y `sortOrder`
  } = validatedParams;

  const DEFAULT_LIMIT = 10;
  const MAX_LIMIT = 20;
  const pageNumber = parseInt(page, 10);
  const limitNumber = Math.min(parseInt(limit, 10), MAX_LIMIT);

  if (
    isNaN(pageNumber) ||
    pageNumber < 1 ||
    isNaN(limitNumber) ||
    limitNumber < 1
  ) {
    console.error("❌ Error: Parámetros de paginación inválidos");
    throw new Error("Invalid pagination parameters");
  }

  console.log("📌 Paginación:", { pageNumber, limitNumber });

  const offset = (pageNumber - 1) * limitNumber;

  // Mapeo para extraer `sortBy` y `sortOrder`
  const sortMapping = {
    username_asc: { field: "username", order: "asc" },
    username_desc: { field: "username", order: "desc" },
    email_asc: { field: "email", order: "asc" },
    email_desc: { field: "email", order: "desc" },
    created_at_asc: { field: "created_at", order: "asc" },
    created_at_desc: { field: "created_at", order: "desc" },
  };

  const { field: sortBy, order: sortOrder } =
    sortMapping[sort] || sortMapping.created_at_desc;

  console.log("🔀 Ordenamiento:", { sortBy, sortOrder });

  let query = supabase
    .from("users")
    .select(
      "id, username, name, surnames, email, role, is_active, created_at, updated_at",
      { count: "exact" }
    );

  // Aplicar filtros
  if (role) {
    query = query.eq("role", role);
    console.log("🎭 Filtro aplicado - Role:", role);
  }
  if (search) {
    const searchTerm = `%${search}%`;
    query = query.or(
      `username.ilike.${searchTerm},email.ilike.${searchTerm},name.ilike.${searchTerm}`
    );
    console.log("🔍 Filtro aplicado - Search:", search);
  }

  // Aplicar ordenamiento
  query = query.order(sortBy, { ascending: sortOrder === "asc" });

  // Aplicar paginación
  query = query.range(offset, offset + limitNumber - 1);

  console.log("🛠 Consulta generada antes de ejecutarla:", query);

  const { data, error, count } = await query;

  if (error) {
    console.error("❌ Error en la consulta a Supabase:", error.message);
    throw new Error(error.message);
  }

  console.log("✅ Datos obtenidos:", { data, total: count });

  return {
    users: data,
    total: count,
    page: pageNumber,
    totalPages: Math.ceil(count / limitNumber),
  };
};

// Obtener detalles de un usuario por ID
export const getUserDetailsService = async (userId) => {
  // Validar el ID del usuario con Zod
  validateUserId(userId);

  // Consultar los detalles del usuario en la base de datos
  const { data, error } = await supabase
    .from("users")
    .select(
      "id, username, name, surnames, email, role, is_active, created_at, updated_at"
    )
    .eq("id", userId)
    .single();

  if (error || !data) {
    throw new Error("User not found");
  }

  return data;
};

// Eliminar un usuario por ID
export const deleteUserService = async (userId) => {
  // Validar el ID del usuario con Zod (si ya lo tienes implementado)
  validateUserId(userId);

  // Obtener el usuario antes de eliminarlo
  const { data: user, error } = await supabase
    .from("users")
    .select("id, role")
    .eq("id", userId)
    .single();

  if (error || !user) {
    throw new Error("Usuario no encontrado");
  }

  // Verificar si el usuario es un superadministrador
  if (user.role === "superadmin") {
    throw new Error("No puedes eliminar la cuenta de un Superadmin");
  }

  // Intentar eliminar al usuario
  const { error: deleteError } = await supabase
    .from("users")
    .delete()
    .eq("id", userId);

  // Si hubo un error de eliminación, revisar si es un error de clave foránea
  if (deleteError) {
    if (deleteError.message.includes("foreign key")) {
      throw new Error(
        "Este usuario no se puede eliminar por que esta asociado a varios productos"
      );
    } else {
      throw new Error("Error al borrar el Usuario");
    }
  }

  return { message: "Usuario eliminado correctamente" };
};

// Activar o desactivar un usuario por ID
export const toggleUserActiveStatusService = async (userId, isActive) => {
  // Validar el ID del usuario con Zod
  validateUserId(userId);

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

  return {
    message: `User ${isActive ? "activated" : "deactivated"} successfully`,
  };
};
