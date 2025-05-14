import {
  registerUserService,
  loginUserService,
  logoutUserService,
  refreshAccessTokenService,
  getProfileService,
  forgotPasswordService,
  resetPasswordService,
  validateResetTokenService,
} from "../services/authService.js";
import { ZodError } from "zod";

// Registro de usuario
export const register = async (req, res) => {
  try {
    const result = await registerUserService(req.body);
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      const zodErrors = error.errors.map((err) => err.message);
      return res.status(400).json({ error: zodErrors.join(", ") });
    }
    res.status(500).json({ error: error.message });
  }
};

// Inicio de sesión
export const login = async (req, res) => {
  try {
    const result = await loginUserService(req.body);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      const zodErrors = error.errors.map((err) => err.message);
      return res.status(400).json({ error: zodErrors.join(", ") });
    }
    if (error.message === "Credenciales invalidas") {
      return res.status(401).json({ error: "Credenciales invalidas" });
    }

    if (error.message === "Contraseña incorrecta") {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }
    res.status(500).json({ error: error.message });
  }
};

// Cerrar sesión
export const logout = async (req, res) => {
  try {
    await logoutUserService(req.user.id);
    res.status(200).json({ message: "Sesion cerrada correctamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Refrescar token
export const refreshAccessToken = async (req, res) => {
  try {
    const result = await refreshAccessTokenService(req.body.refreshToken);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      const zodErrors = error.errors.map((err) => err.message);
      return res.status(400).json({ error: zodErrors.join(", ") });
    }
    if (error.message === "Invalid or expired refresh token") {
      return res.status(401).json({ error: "Invalido o token expirado" });
    }
    res.status(500).json({ error: error.message });
  }
};

// Obtener perfil
export const getProfile = async (req, res) => {
  try {
    const user = await getProfileService(req.user.id);
    res.status(200).json({
      message: "Profile retrieved successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Solicitar restablecimiento de contraseña
export const forgotPassword = async (req, res) => {
  try {
    const result = await forgotPasswordService(req.body.email);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
};

// Restablecer contraseña
export const resetPassword = async (req, res) => {
  try {
    const result = await resetPasswordService(req.body);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      const zodErrors = error.errors.map((err) => err.message);
      return res.status(400).json({ error: zodErrors.join(", ") });
    }
    if (error.message === "Invalid or expired token") {
      return res.status(400).json({ error: "Token invalido o expirado" });
    }
    if (error.message === "User not found") {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    if (
      error.message ===
      "New password must be different from the current password"
    ) {
      return res.status(400).json({
        error: "La nueva contraseña tiene que ser diferente a la actual",
      });
    }
    res.status(500).json({ error: error.message });
  }
};

export const validateResetToken = async (req, res) => {
  try {
    const { token } = req.body;

    // Llamar al servicio para validar el token
    await validateResetTokenService(token);

    // Si no hay errores, el token es válido
    res.status(200).json({ message: "Token is valid" });
  } catch (error) {
    console.error("Error during token validation:", error.message);

    // Manejar errores específicos
    if (error.message === "The token has expired. Please request a new one.") {
      return res
        .status(400)
        .json({ error: "El token ha expirado. Por favor solicita uno nuevo." });
    }
    if (
      error.message ===
      "The token has an invalid format. Please check the link or request a new one."
    ) {
      return res.status(400).json({
        error:
          "El token tiene un formato invalido. Por favor revisa el link o solicita uno nuevo.",
      });
    }
    if (error.message === "Invalid or expired token JWT") {
      return res
        .status(400)
        .json({ error: "El token es invalido o ha expirado." });
    }
    if (error.message === "Invalid or expired token BD") {
      return res
        .status(400)
        .json({ error: "El token es invalido o ha expirado." });
    }

    // Manejar otros errores inesperados
    res
      .status(500)
      .json({ error: "An unexpected error occurred. Please try again later." });
  }
};
