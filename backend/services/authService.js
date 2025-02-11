import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import supabase from "../config/db.js";
import { validateRegister, validateLogin, resetPasswordSchema } from "../validations/authValidation.js";
import { isUsernameValid } from "../utils/validationUtils.js";

// Generar token de restablecimiento de contraseña
export const generateResetToken = (userId) => {
    return jwt.sign({ userId }, process.env.RESET_PASSWORD_SECRET, { expiresIn: "15m" });
};

// Enviar correo electrónico con el enlace de restablecimiento
export const sendResetEmail = async (email, resetLink) => {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Restablecimiento de Contraseña",
        html: `
            <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
            <p>Haz clic en el siguiente enlace para restablecerla:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>Este enlace expirará en 15 minutos.</p>
        `,
    };

    await transporter.sendMail(mailOptions);
};

// Registrar usuario
export const registerUserService = async (userData) => {
    // Validar los datos con Zod
    const { username, name, surnames, email, password, role } = validateRegister(userData);

    // Validar formato adicional del username
    if (!isUsernameValid(username)) {
        throw new Error("Username can only contain letters, numbers, underscores (_), and hyphens (-)");
    }

    // Verificar si el username ya está en uso
    const { data: existingUsername } = await supabase
        .from("users")
        .select("id")
        .eq("username", username)
        .single();
    if (existingUsername) {
        throw new Error("Username is already in use by another user");
    }

    // Verificar si el email ya está en uso
    const { data: existingEmail } = await supabase
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

export const loginUserService = async ({ email, password }) => {
    try {
        // Validar los datos con Zod
        const { email: validatedEmail, password: validatedPassword } = validateLogin({ email, password });

        // Buscar al usuario por correo electrónico
        const { data: user, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("email", validatedEmail)
            .single();

        if (userError || !user) {
            console.error("User not found or database error:", userError);
            throw new Error("Invalid credentials");
        }

        // Verificar la contraseña
        const isMatch = await bcrypt.compare(validatedPassword, user.password);
        if (!isMatch) {
            console.error("Password mismatch:", validatedPassword, user.password);
            throw new Error("Invalid credentials");
        }

        // Generar tokens
        const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
        const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_SECRET, { expiresIn: "7d" });

        // Guardar el refresh token en la BD
        const { error: updateError } = await supabase
            .from("users")
            .update({ refresh_token: refreshToken })
            .eq("id", user.id);

        if (updateError) {
            console.error("Error updating refresh token:", updateError);
            throw new Error("Error updating refresh token");
        }

        return {
            accessToken,
            refreshToken,
            user: { id: user.id, username: user.username, role: user.role },
        };
    } catch (error) {
        console.error("Error in loginUserService:", error);
        throw error;
    }
};

// Cerrar sesión
export const logoutUserService = async (userId) => {
    // Eliminar el refresh token del usuario en la base de datos
    const { error } = await supabase
        .from("users")
        .update({ refresh_token: null })
        .eq("id", userId);

    if (error) {
        throw new Error("Error logging out");
    }

    return { message: "Session closed successfully" };
};

// Refrescar token de acceso
export const refreshAccessTokenService = async (refreshToken) => {
    // Verificar el refresh token
    let decoded;
    try {
        decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    } catch (error) {
        throw new Error("Invalid or expired refresh token");
    }

    // Buscar al usuario por ID y validar el refresh token almacenado
    const { data, error } = await supabase
        .from("users")
        .select("id, role, refresh_token")
        .eq("id", decoded.id)
        .single();

    if (error || !data || data.refresh_token !== refreshToken) {
        throw new Error("Invalid or expired refresh token");
    }

    // Generar nuevos tokens
    const newAccessToken = jwt.sign({ id: data.id, role: data.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const newRefreshToken = jwt.sign({ id: data.id }, process.env.REFRESH_SECRET, { expiresIn: "7d" });

    // Actualizar el refresh token en la base de datos
    const { error: updateError } = await supabase
        .from("users")
        .update({ refresh_token: newRefreshToken })
        .eq("id", data.id);

    if (updateError) {
        throw new Error("Error updating refresh token");
    }

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

// Obtener perfil del usuario
export const getProfileService = async (userId) => {
    // Consultar los datos del usuario en la base de datos
    const { data, error } = await supabase
        .from("users")
        .select("id, name, surnames, username, email, role")
        .eq("id", userId)
        .single();

    if (error || !data) {
        throw new Error("User not found");
    }

    return data;
};

// Solicitar restablecimiento de contraseña
export const forgotPasswordService = async (email) => {
    // Validar el correo electrónico
    if (!email) {
      throw new Error("Email is required");
    }
  
    // Verificar si el usuario existe
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, email")
      .eq("email", email)
      .single();
  
    if (userError || !user) {
      throw new Error("User not found");
    }
  
    // Generar un nuevo token único
    const resetToken = generateResetToken(user.id);
  
    // Guardar el token en la base de datos (invalida tokens anteriores)
    const { error: updateError } = await supabase
      .from("users")
      .update({ reset_token: resetToken }) // Almacenar el token en la columna `reset_token`
      .eq("id", user.id);
  
    if (updateError) {
      throw new Error("Error saving reset token");
    }
  
    // Construir el enlace de restablecimiento
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
    // Enviar correo electrónico con el enlace
    await sendResetEmail(user.email, resetLink);
  
    return { message: "Password reset link sent to your email" };
  };

// Restablecer contraseña
// Restablecer contraseña
// Restablecer contraseña
export const resetPasswordService = async ({ token, newPassword }) => {
    // Validar los datos con Zod
    const validatedData = resetPasswordSchema.parse({ token, newPassword });
  
    // Verificar el token
    let decodedToken;
    try {
      decodedToken = jwt.verify(validatedData.token, process.env.RESET_PASSWORD_SECRET);
    } catch (error) {
      throw new Error("Invalid or expired token JWT");
    }
  
    const userId = decodedToken.userId;
  
    // Obtener los datos actuales del usuario
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("password, reset_token") // Incluimos el campo reset_token
      .eq("id", userId)
      .single();
  
    if (userError || !user) {
      throw new Error("User not found");
    }
  
    // Verificar si el token proporcionado coincide con el token almacenado
    if (user.reset_token !== validatedData.token) {
      throw new Error("Invalid or expired token BD");
    }
  
    // Verificar si la nueva contraseña es igual a la actual
    const isSamePassword = await bcrypt.compare(validatedData.newPassword, user.password);
    if (isSamePassword) {
      throw new Error("New password must be different from the current password");
    }
  
    // Cifrar la nueva contraseña
    const hashedPassword = await bcrypt.hash(validatedData.newPassword, 10);
  
    // Actualizar la contraseña, limpiar el token de restablecimiento y actualizar el campo updated_at
    const { error } = await supabase
      .from("users")
      .update({
        password: hashedPassword,
        reset_token: null, // Limpiar el token después de usarlo
        updated_at: new Date().toISOString(), // Actualizamos el campo updated_at
      })
      .eq("id", userId);
  
    if (error) {
      throw new Error("Error updating password");
    }
  
    return { message: "Password updated successfully" };
  };

  export const validateResetTokenService = async (token) => {
    try {
      console.log("Iniciando validación del token:", token);
  
      // Verificar el token
      console.log("Verificando el token...");
      const decodedToken = jwt.verify(token, process.env.RESET_PASSWORD_SECRET);
      console.log("Token verificado exitosamente. Decoded token:", decodedToken);
  
      // Extraer el ID del usuario del token
      const userId = decodedToken.userId;
  
      // Verificar si el usuario existe en la base de datos y obtener su token almacenado
      console.log("Buscando al usuario en la base de datos...");
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("id, reset_token") // Incluimos el campo reset_token
        .eq("id", userId)
        .single();
  
      // Si hay un error o el usuario no existe, lanzamos un error específico
      if (userError || !user) {
        throw new Error("User not found");
      }
  
      console.log("Usuario encontrado en la base de datos:", user);
  
      // Verificar si el token proporcionado coincide con el token almacenado
      if (user.reset_token !== token) {
        throw new Error("Invalid or expired token"); // Mensaje genérico
      }
  
      console.log("El token coincide con el almacenado en la base de datos.");
  
      // Si todo está bien, el token es válido
      console.log("El token es válido.");
    } catch (error) {
      console.error("Error durante la validación del token:", error.message);
  
      // Manejar errores específicos
      if (error.name === "TokenExpiredError") {
        throw new Error("The token has expired. Please request a new one.");
      }
      if (error.name === "JsonWebTokenError" || error instanceof SyntaxError) {
        // Manejar errores específicos de formato inválido
        if (error.message.includes("bad control character")) {
          throw new Error("The token has an invalid format. Please check the link or request a new one.");
        }
        throw new Error("Invalid or expired token JWT"); // Mensaje genérico para tokens JWT inválidos
      }
      if (error.message === "User not found") {
        throw new Error("User not found");
      }
      if (error.message === "Invalid or expired token") {
        throw new Error("Invalid or expired token BD");
      }
  
      // Manejar otros errores inesperados
      throw new Error("An unexpected error occurred. Please try again later.");
    }
  };