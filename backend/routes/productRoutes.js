import express from 'express';
import {
    createProduct,
    listProducts,
    updateProduct,
    deleteProduct,
    adjustStock,
    uploadImage,
    deleteImage,
    listProductImages
} from '../controllers/productController.js';
/*import { listHistory } from '../controllers/historyController.js';
import {
    createNote,
    listNotes,
    updateNote,
    deleteNote
} from '../controllers/noteController.js';*/
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rutas principales de productos
router.post('/', authMiddleware, createProduct);
router.get('/', authMiddleware, listProducts);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);
router.post('/:id/adjust-stock', authMiddleware, adjustStock);
router.post('/:id/upload-image', authMiddleware, uploadImage);
router.delete('/:id/images/:imageId', authMiddleware, deleteImage);
router.get('/:id/images', authMiddleware, listProductImages);

/*
// Rutas anidadas: Historial
router.get('/:id/history', authMiddleware, listHistory);

// Rutas anidadas: Notas
router.get('/:id/notes', authMiddleware, listNotes);
router.post('/:id/notes', authMiddleware, createNote);
router.put('/:id/notes/:noteId', authMiddleware, updateNote);
router.delete('/:id/notes/:noteId', authMiddleware, deleteNote);
*/
export default router;