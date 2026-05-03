import express from 'express';
import userRoutes from './user.routes.js';
import swaggerRoutes from './swagger.routes.js';

const router = express.Router();

// Monta las rutas de usuario bajo /user para que /api/user/register funcione
router.use('/user', userRoutes);

// Monta la UI de Swagger en /api-docs
router.use('/api-docs', swaggerRoutes);

export default router;
