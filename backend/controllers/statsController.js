import { getTotalProductsService, getTotalLowStockProductsService, getLowStockProductsService, getMovementStatsService, getRecentMovementsService } from "../services/statsService.js";

// Controlador para obtener el número total de productos
export const getTotalProducts = async (req, res) => {
    try {
        const result = await getTotalProductsService();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controlador para obtener el número de productos con stock bajo
export const getTotalLowStockProducts = async (req, res) => {
    try {
        const result = await getTotalLowStockProductsService();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controlador para obtener los 5 productos con stock más bajo
export const getLowStockProducts = async (req, res) => {
    try {
        const products = await getLowStockProductsService();
        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controlador para obtener el número total de entradas y salidas
export const getMovementStats = async (req, res) => {
    try {
        const stats = await getMovementStatsService();
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controlador para obtener los 5 movimientos más recientes
export const getRecentMovements = async (req, res) => {
    try {
        const movements = await getRecentMovementsService();
        res.status(200).json({ movements });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};