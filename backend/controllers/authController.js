import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import supabase from "../config/db.js";

// 🛠 Esquema de validación con Zod para el registro
const registerSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    name: z.string().min(2, "Name must be at least 2 characters long"),
    surnames: z.string().min(2, "Surnames must be at least 2 characters long"),
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    role: z.string().default("employee").optional(), // Role por defecto es 'employee'
});

// 🛠 Esquema de validación con Zod para el login
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

// 🔑 Función para generar **Access Token** y **Refresh Token**
const generateTokens = (userId, role) => {
    const accessToken = jwt.sign({ id: userId, role }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: userId }, process.env.REFRESH_SECRET, { expiresIn: "7d" });
    return { accessToken, refreshToken };
};

// Función de **Registro**
const register = async (userData) => {
    // Validar datos con Zod
    const result = registerSchema.safeParse(userData);
    if (!result.success) {
        throw new Error(result.error.errors.map(err => err.message).join(", "));
    }

    const { username, name, surnames, email, password, role = "employee" } = userData;

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario en la base de datos
    const { data, error } = await supabase
        .from("users")
        .insert([{ 
            username, 
            name, 
            surnames, 
            email, 
            password: hashedPassword,
            role 
        }])
        .select("id, username, email, role");

    if (error) throw new Error(error.message);

    // Generar tokens
    const { accessToken, refreshToken } = generateTokens(data[0].id, data[0].role);

    // Guardar el Refresh Token en la base de datos
    await supabase
        .from("users")
        .update({ refresh_token: refreshToken })
        .eq("id", data[0].id);

    return { accessToken, refreshToken, user: data[0] };
};

//  Función de **Login**
const login = async (email, password) => {
    // Validar datos con Zod
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
        throw new Error(result.error.errors.map(err => err.message).join(", "));
    }

    // Buscar usuario por email
    const { data, error } = await supabase
        .from("users")
        .select("id, username, email, password, role, refresh_token")
        .eq("email", email)
        .single();

    if (error || !data) throw new Error("Usuario no encontrado");

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, data.password);
    if (!isMatch) throw new Error("Contraseña incorrecta");

    // Generar nuevos tokens
    const { accessToken, refreshToken } = generateTokens(data.id, data.role);

    // Guardar el nuevo Refresh Token en la base de datos
    await supabase
        .from("users")
        .update({ refresh_token: refreshToken })
        .eq("id", data.id);

    return { accessToken, refreshToken, user: { id: data.id, username: data.username, email: data.email, role: data.role } };
};

const logout = async (userId) => {
    await supabase
        .from("users")
        .update({ refresh_token: null }) // Se elimina el Refresh Token
        .eq("id", userId);
};

const refreshAccessToken = async (refreshToken) => {
    if (!refreshToken) throw new Error("Refresh Token es requerido");

    // Buscar usuario con ese Refresh Token
    const { data, error } = await supabase
        .from("users")
        .select("id, role, refresh_token")
        .eq("refresh_token", refreshToken)
        .single();

    if (error || !data) throw new Error("Token inválido o expirado");

    // Verificar que el Refresh Token es válido
    try {
        jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    } catch {
        throw new Error("Token inválido o expirado");
    }

    // Generar un nuevo Access Token
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(data.id, data.role);

    // Actualizar el nuevo Refresh Token en la base de datos
    await supabase
        .from("users")
        .update({ refresh_token: newRefreshToken })
        .eq("id", data.id);

    return { accessToken, refreshToken: newRefreshToken };
};

export { register, login, logout, refreshAccessToken };
