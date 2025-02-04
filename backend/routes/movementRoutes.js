import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import {
    listMovements,
    getMovementDetails,
    startMovement,
    scanProducts,
    confirmMovement,
    listPendingProducts,
    getPendingProductDetails,
    registerPendingProduct
} from '../controllers/movementController.js';

const router = express.Router();

// Listar movimientos finalizados
router.get('/', authMiddleware, listMovements);

// Obtener detalles de un movimiento específico
router.get('/:id', authMiddleware, getMovementDetails); 

// Iniciar un movimiento temporal
router.post('/start', authMiddleware, startMovement);

// Escanear productos en el carrito temporal
router.post('/temp/:id/scan', authMiddleware, scanProducts);

// Confirmar un movimiento
router.post('/temp/:id/confirm', authMiddleware, confirmMovement);

// Listar productos pendientes
router.get('/pending-reviews', authMiddleware, listPendingProducts);

// Obtener detalles de un producto pendiente específico
router.get('/pending-reviews/:id', authMiddleware, getPendingProductDetails);

// Registrar un producto pendiente
router.post('/pending-reviews/:id/register', authMiddleware, registerPendingProduct);
export default router;