import express from 'express';
import authRoutes from './routes/authRoutes.js';
import cors from 'cors';

// Crear una aplicación de Express
const app = express();

// Middlewares
app.use(express.json()); // Para parsear JSON en las solicitudes
app.use(cors()); // Para habilitar CORS

// Rutas
app.use('/api/auth', authRoutes);

// Configuración del puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
