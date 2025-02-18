import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  listMovements,
  getMovementDetails,
  startMovement,
  scanProducts,
  updateScannedProductQuantity,
  deleteScannedProduct,
  confirmMovement,
  getPendingMovement,
  deleteTempMovement,
} from "../controllers/movementController.js";

const router = express.Router();

// Listar movimientos finalizados
router.get("/", authMiddleware, listMovements);

// Detectar movimientos no confirmados (Paso 1)
router.get("/pending", authMiddleware, getPendingMovement);

// Obtener detalles de un movimiento específico
router.get("/:id", authMiddleware, getMovementDetails);

// Iniciar un movimiento temporal
router.post("/start", authMiddleware, startMovement);

// Escanear productos en el carrito temporal
router.post("/temp/:id/scan", authMiddleware, scanProducts);

// Editar cantidad de un producto escaneado
router.put(
  "/temp/:temp_movement_id/products/:barcode/quantity",
  authMiddleware,
  updateScannedProductQuantity
);

// Eliminar un producto escaneado
router.delete(
  "/temp/:temp_movement_id/products/:barcode",
  authMiddleware,
  deleteScannedProduct
);

// Confirmar un movimiento
router.post("/temp/:id/confirm", authMiddleware, confirmMovement);
router.delete("/temp/:id", authMiddleware, deleteTempMovement);

export default router;
