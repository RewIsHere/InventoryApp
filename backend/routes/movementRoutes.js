import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import {
    startMovement,
    scanProducts,
    confirmMovement,
    registerPendingProduct,
    listMovements,
    getMovementDetails
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


export default router;