import express from 'express';
import userRoutes from './user.routes.js';

const router = express.Router();

// Monta las rutas de usuario bajo /user para que /api/user/register funcione
router.use('/user', userRoutes);

export default router;
