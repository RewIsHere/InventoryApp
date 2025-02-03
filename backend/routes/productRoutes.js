import express from 'express';
import {
    createProduct,
    listProducts,
    listFilteredProducts,
    updateProduct,
    deleteProduct,
    adjustStock,
    toggleProductStatus,
    getProductDetails,
    uploadImage,
    deleteImage,
    listProductImages
} from '../controllers/productController.js';
import { listHistory } from '../controllers/historyController.js';
import {
    createNote,
    listNotes,
    updateNote,
    deleteNote
} from '../controllers/noteController.js';
import {
    createCategory,
    listCategories,
    updateCategory,
    deleteCategory
} from '../controllers/categoryController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rutas principales de productos
router.post('/', authMiddleware, createProduct);
router.get('/', authMiddleware, listProducts);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);
router.post('/:id/adjust-stock', authMiddleware, adjustStock);
router.put('/:id/status', authMiddleware, toggleProductStatus);
router.post('/:id/upload-image', authMiddleware, uploadImage);
router.delete('/:id/images/:imageId', authMiddleware, deleteImage);
router.get('/:id/images', authMiddleware, listProductImages);
router.get('/:id/details', authMiddleware, getProductDetails);


// Rutas anidadas: Historial
router.get('/:id/history', authMiddleware, listHistory);

// Rutas anidadas: Notas
router.get('/:id/notes', authMiddleware, listNotes);
router.post('/:id/notes', authMiddleware, createNote);
router.put('/:id/notes/:noteId', authMiddleware, updateNote);
router.delete('/:id/notes/:noteId', authMiddleware, deleteNote);

// Rutas anidadas: Categorías
router.post('/:id/categories', authMiddleware, createCategory);
router.get('/:id/categories', authMiddleware, listCategories);
router.put('/:id/categories/:categoryId', authMiddleware, updateCategory);
router.delete('/:id/categories/:categoryId', authMiddleware, deleteCategory);

export default router;