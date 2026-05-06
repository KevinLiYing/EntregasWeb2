import express from 'express';
import userRoutes from './user.routes.js';
import swaggerRoutes from './swagger.routes.js';
import clientRoutes from './client.routes.js';
import projectRoutes from './project.routes.js';
import deliverynoteRoutes from './deliverynote.routes.js';

const router = express.Router();

// Monta las rutas de usuario bajo /user para que /api/user/register funcione
router.use('/user', userRoutes);
// Monta la UI de Swagger en /api-docs
router.use('/api-docs', swaggerRoutes);
// Monta las rutas de client, project y deliverynote
router.use('/client', clientRoutes);
router.use('/project', projectRoutes);
router.use('/deliverynote', deliverynoteRoutes);

export default router;
