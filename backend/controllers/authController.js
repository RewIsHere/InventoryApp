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