// src/routes/client.routes.js
import { Router } from 'express';
import * as clientController from '../controllers/client.controller.js';
import { validate } from '../middleware/validate.js';
import { createClientSchema, updateClientSchema, clientIdParamSchema } from '../validators/client.validator.js';
import { checkClientExists, checkClientNotArchived } from '../middleware/client.middleware.js';
import { auth } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', auth, validate(createClientSchema), clientController.createClient);
router.get('/', auth, clientController.getClients);
router.get('/archived', auth, clientController.getArchivedClients);
router.get('/:id', auth, validate(clientIdParamSchema, 'params'), checkClientExists, clientController.getClientById);
router.put('/:id', auth, validate(clientIdParamSchema, 'params'), validate(updateClientSchema), checkClientExists, checkClientNotArchived, clientController.updateClient);
router.delete('/:id', auth, validate(clientIdParamSchema, 'params'), checkClientExists, clientController.deleteClient);
router.patch('/:id/restore', auth, validate(clientIdParamSchema, 'params'), checkClientExists, clientController.restoreClient);

export default router;
