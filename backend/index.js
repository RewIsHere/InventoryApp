import express from 'express';
import authRoutes from './routes/authRoutes.js';
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
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/products/categories', categoryRoutes);
app.use('/api/movements', movementRoutes);
app.use('/api/pending-reviews', pendingProductsRoutes);

// Configuración del puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
