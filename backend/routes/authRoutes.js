import express from 'express';
import { register, login } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Ruta para registrar un usuario
router.post('/register', async (req, res) => {
    const { username, name, surnames, email, password, role } = req.body;

    try {
        const user = await register(username, name, surnames, email, password, role);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Ruta para loguearse
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const { token, user } = await login(email, password);
        res.json({ token, user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Ruta para obtener el perfil del usuario (protegida)
router.get('/profile', authMiddleware, (req, res) => {
    res.json(req.user); // Aquí deberías devolver los detalles del usuario si la autenticación fue exitosa
});

export default router;
