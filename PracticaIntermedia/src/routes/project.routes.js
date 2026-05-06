// src/routes/project.routes.js
import { Router } from 'express';
import * as projectController from '../controllers/project.controller.js';
import { validate } from '../middleware/validate.js';
import { createProjectSchema, updateProjectSchema, projectIdParamSchema } from '../validators/project.validator.js';
import { checkProjectExists, checkProjectNotArchived } from '../middleware/project.middleware.js';
import { auth } from '../middleware/auth.middleware.js';


/**
 * @swagger
 * tags:
 *   name: Project
 *   description: Endpoints para gestión de proyectos
 */
const router = Router();

/**
 * @swagger
 * /api/project:
 *   post:
 *     summary: Crear un proyecto
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *           example:
 *             name: Reforma Local
 *             code: PRJ-001
 *             address:
 *               street: Calle Nueva
 *               number: "7"
 *               postal: "28004"
 *               city: Madrid
 *               province: Madrid
 *             client: 6634e7b2f1a2b2c1d2e3f4a7
 *     responses:
 *       201:
 *         description: Proyecto creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Cliente no encontrado
 *       409:
 *         description: Proyecto con ese código ya existe
 */
router.post('/', auth, validate(createProjectSchema), projectController.createProject);
/**
 * @swagger
 * /api/project:
 *   get:
 *     summary: Listar todos los proyectos
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Página de resultados
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Resultados por página
 *       - in: query
 *         name: client
 *         schema:
 *           type: string
 *         description: Filtrar por ID de cliente
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Búsqueda parcial por nombre
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filtrar por proyectos activos
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: "Ordenación (ejemplo: createdAt)"
 *     responses:
 *       200:
 *         description: Lista de proyectos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 projects:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 *                 totalItems:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *       401:
 *         description: No autorizado
 */
router.get('/', auth, projectController.getProjects);
/**
 * @swagger
 * /api/project/archived:
 *   get:
 *     summary: Listar proyectos archivados
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de proyectos archivados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 *       401:
 *         description: No autorizado
 */
router.get('/archived', auth, projectController.getArchivedProjects);
/**
 * @swagger
 * /api/project/{id}:
 *   get:
 *     summary: Obtener un proyecto concreto
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto
 *     responses:
 *       200:
 *         description: Proyecto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Proyecto no encontrado
 */
router.get('/:id', auth, validate(projectIdParamSchema, 'params'), checkProjectExists, projectController.getProjectById);
/**
 * @swagger
 * /api/project/{id}:
 *   put:
 *     summary: Actualizar un proyecto
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *           example:
 *             name: Proyecto Actualizado
 *             code: PRJ-002
 *             address:
 *               street: Calle Actualizada
 *               number: "8"
 *               postal: "28005"
 *               city: Madrid
 *               province: Madrid
 *             client: 6634e7b2f1a2b2c1d2e3f4a7
 *     responses:
 *       200:
 *         description: Proyecto actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Proyecto no encontrado
 */
router.put('/:id', auth, validate(projectIdParamSchema, 'params'), validate(updateProjectSchema), checkProjectExists, checkProjectNotArchived, projectController.updateProject);
/**
 * @swagger
 * /api/project/{id}:
 *   delete:
 *     summary: Archivar (soft) o borrar (hard) un proyecto
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto
 *       - in: query
 *         name: soft
 *         schema:
 *           type: boolean
 *         description: Si es true, archiva; si es false, borra definitivamente
 *     responses:
 *       200:
 *         description: Proyecto archivado o borrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Proyecto no encontrado
 */
router.delete('/:id', auth, validate(projectIdParamSchema, 'params'), checkProjectExists, projectController.deleteProject);
/**
 * @swagger
 * /api/project/{id}/restore:
 *   patch:
 *     summary: Restaurar un proyecto archivado
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto
 *     responses:
 *       200:
 *         description: Proyecto restaurado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Proyecto no encontrado o no archivado
 */
router.patch('/:id/restore', auth, validate(projectIdParamSchema, 'params'), checkProjectExists, projectController.restoreProject);

export default router;
