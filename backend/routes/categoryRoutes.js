import express from 'express';
import {
    createCategory,
    listCategories,
    updateCategory,
    deleteCategory
} from '../controllers/categoryController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createCategory);
router.get('/', authMiddleware, listCategories);
router.put('/:id', authMiddleware, updateCategory);
router.delete('/:id', authMiddleware, deleteCategory);

export default router;