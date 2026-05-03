// src/routes/project.routes.js
import { Router } from 'express';
import * as projectController from '../controllers/project.controller.js';
import { validate } from '../middleware/validate.js';
import { createProjectSchema, updateProjectSchema, projectIdParamSchema } from '../validators/project.validator.js';
import { checkProjectExists, checkProjectNotArchived } from '../middleware/project.middleware.js';
import { auth } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', auth, validate(createProjectSchema), projectController.createProject);
router.get('/', auth, projectController.getProjects);
router.get('/archived', auth, projectController.getArchivedProjects);
router.get('/:id', auth, validate(projectIdParamSchema, 'params'), checkProjectExists, projectController.getProjectById);
router.put('/:id', auth, validate(projectIdParamSchema, 'params'), validate(updateProjectSchema), checkProjectExists, checkProjectNotArchived, projectController.updateProject);
router.delete('/:id', auth, validate(projectIdParamSchema, 'params'), checkProjectExists, projectController.deleteProject);
router.patch('/:id/restore', auth, validate(projectIdParamSchema, 'params'), checkProjectExists, projectController.restoreProject);

export default router;
