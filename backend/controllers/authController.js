import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import supabase from "../config/db.js";
import { z } from "zod";

// Esquemas de validación con Zod
const userSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    name: z.string().min(1, "Name is required"),
    surnames: z.string().min(1, "Surnames are required"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    role: z.enum(["admin", "user"], "Invalid role").optional(),
});

const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

// Registrar un usuario
export const register = async (username, name, surnames, email, password, role) => {
    // Validar los datos con Zod
    try {
        userSchema.parse({ username, name, surnames, email, password, role });
    } catch (error) {
        throw new Error(error.errors.map(e => e.message).join(", "));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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
