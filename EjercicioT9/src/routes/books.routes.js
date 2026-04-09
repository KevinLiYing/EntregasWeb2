import { Router } from 'express';
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} from '../controllers/books.controller.js';
import { authRequired, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

// Listar libros (público)
router.get('/books', getBooks);

// Obtener libro por ID (público)
router.get('/books/:id', getBookById);

// Crear libro (Librarian/Admin)
router.post('/books', authRequired, requireRole(['LIBRARIAN', 'ADMIN']), createBook);

// Actualizar libro (Librarian/Admin)
router.put('/books/:id', authRequired, requireRole(['LIBRARIAN', 'ADMIN']), updateBook);

// Eliminar libro (solo Admin)
router.delete('/books/:id', authRequired, requireRole(['ADMIN']), deleteBook);

export default router;
