import express from 'express';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import movementRoutes from './routes/movementRoutes.js';
import pendingProductsRoutes from './routes/pendingProductsRoutes.js';
import cors from 'cors';

// Crear una aplicación de Express
const app = express();

// Middlewares
app.use(express.json()); // Para parsear JSON en las solicitudes
app.use(cors()); // Para habilitar CORS

// Rutas
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/products/categories', categoryRoutes);
app.use('/api/v1/movements', movementRoutes);
app.use('/api/v1/pending-reviews', pendingProductsRoutes);

// Configuración del puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
