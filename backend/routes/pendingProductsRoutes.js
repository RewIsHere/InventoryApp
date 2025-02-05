import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import {
    listPendingProducts,
    getPendingProductDetails,
    registerPendingProduct
} from '../controllers/pendingProductsController.js';

const router = express.Router();

// Listar productos pendientes
router.get('/', authMiddleware, listPendingProducts);

// Obtener detalles de un producto pendiente específico
router.get('/:id', authMiddleware, getPendingProductDetails);

// Registrar un producto pendiente
router.post('/:id/register', authMiddleware, registerPendingProduct);
export default router;