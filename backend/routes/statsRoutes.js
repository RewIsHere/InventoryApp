import express from "express";
import { getTotalProducts, getTotalLowStockProducts, getLowStockProducts, getMovementStats, getRecentMovements } from "../controllers/statsController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Ruta para obtener el número total de productos
router.get("/total-products", authMiddleware, getTotalProducts);

// Ruta para obtener el número de productos con stock bajo
router.get("/total-low-stock-products", authMiddleware, getTotalLowStockProducts);

// Ruta para obtener los 5 productos con stock más bajo
router.get("/low-stock-products-details", authMiddleware, getLowStockProducts);

// Ruta para obtener el número total de entradas y salidas
router.get("/movement-stats", authMiddleware, getMovementStats);

// Ruta para obtener los 5 movimientos más recientes
router.get("/recent-movements", authMiddleware, getRecentMovements);

export default router;