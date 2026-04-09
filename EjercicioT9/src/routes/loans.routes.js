import { Router } from 'express';
import {
  getMyLoans,
  getAllLoans,
  createLoan,
  returnLoan
} from '../controllers/loans.controller.js';
import { authRequired, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

// Listar mis préstamos (autenticado)
router.get('/loans', authRequired, getMyLoans);

// Listar todos los préstamos (solo librarian/admin)
router.get('/loans/all', authRequired, requireRole(['LIBRARIAN', 'ADMIN']), getAllLoans);

// Solicitar préstamo (autenticado)
router.post('/loans', authRequired, createLoan);

// Devolver libro (autenticado)
router.put('/loans/:id/return', authRequired, returnLoan);

export default router;
