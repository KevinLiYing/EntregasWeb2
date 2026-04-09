import { Router } from 'express';
import {
  register,
  login,
  getProfile
} from '../controllers/auth.controller.js';
import { authRequired } from '../middleware/auth.middleware.js';

const router = Router();

// Registro de usuario
router.post('/auth/register', register);

// Login
router.post('/auth/login', login);

// Perfil autenticado
router.get('/auth/me', authRequired, getProfile);

export default router;
