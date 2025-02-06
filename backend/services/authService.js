import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

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