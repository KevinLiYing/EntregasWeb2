import { Router } from 'express';
import { register, login, me } from '../controllers/auth.controller.js';
import sessionMiddleware from '../middleware/session.middleware.js';

const router = Router();

// POST   /api/auth/register 
router.post('/register', register);

// POST   /api/auth/login
router.post('/login', login);

// GET    /api/auth/me
router.get('/me', sessionMiddleware, me);

export default router;