import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import supabase from "../config/db.js"; // Configuración de Supabase

// Esquema de validación para el registro
const registerSchema = z.object({
    username: z.string().min(1, "Username is required"),
    name: z.string().min(1, "Name is required"),
    surnames: z.string().min(1, "Surnames are required"),
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    role: z.string().default("employee").optional(), // Role por defecto es 'employee'
});

// Esquema de validación para el login
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

// Función de Registro de Usuario
const register = async (username, name, surnames, email, password, role = "employee") => {
    // Validación con Zod
    const result = registerSchema.safeParse({ username, name, surnames, email, password, role });
    if (!result.success) {
        throw new Error(result.error.errors.map(err => err.message).join(", "));
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el nuevo usuario en la base de datos (Supabase)
    const { data, error } = await supabase
        .from("users")
        .insert([{ username, name, surnames, email, password: hashedPassword, role, is_active: true }])
        .select(); // `select()` obtiene los datos insertados

    if (error) throw new Error(error.message); // Si hay un error, lanzamos una excepción

    return data[0]; // Retorna el usuario registrado
};

// Función de Login de Usuario
const login = async (email, password) => {
    // Validación con Zod
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
        throw new Error(result.error.errors.map(err => err.message).join(", "));
    }

    // Buscar al usuario por su email
    const { data, error } = await supabase
        .from("users")
        .select("id, username, name, surnames, email, password, role, is_active, created_at, updated_at") // Seleccionamos los campos necesarios
        .eq("email", email) // Filtramos por email
        .single(); // Usamos .single() para obtener solo un resultado

    if (error || !data) throw new Error("Usuario no encontrado");

    // Verificar si la contraseña ingresada coincide con la encriptada
    const isMatch = await bcrypt.compare(password, data.password);
    if (!isMatch) throw new Error("Contraseña incorrecta");

    // Crear un token JWT
    const token = jwt.sign({ id: data.id, role: data.role }, process.env.JWT_SECRET, {
        expiresIn: "7d", // El token será válido por 7 días
    });

    // Retornar el token y los detalles del usuario
    return { token, user: { id: data.id, username: data.username, name: data.name, surnames: data.surnames, email: data.email, role: data.role, is_active: data.is_active, created_at: data.created_at, updated_at: data.updated_at } };
};

export { register, login };
