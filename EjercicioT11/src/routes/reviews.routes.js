import { Router } from 'express';
import {
  getBookReviews,
  createReview,
  deleteReview
} from '../controllers/reviews.controller.js';

// Middleware de autenticación (debes crearlo o ajustarlo si es necesario)
import { authRequired } from '../middleware/auth.middleware.js';

const router = Router();

// Listar reseñas de un libro (público)
router.get('/books/:id/reviews', getBookReviews);

// Crear reseña (autenticado)
router.post('/books/:id/reviews', authRequired, createReview);

// Eliminar reseña propia (autenticado)
router.delete('/reviews/:id', authRequired, deleteReview);

export default router;
