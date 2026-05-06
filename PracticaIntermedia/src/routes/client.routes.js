// src/routes/client.routes.js
import { Router } from 'express';
import * as clientController from '../controllers/client.controller.js';
import { validate } from '../middleware/validate.js';
import { createClientSchema, updateClientSchema, clientIdParamSchema } from '../validators/client.validator.js';
import { checkClientExists, checkClientNotArchived } from '../middleware/client.middleware.js';
import { auth } from '../middleware/auth.middleware.js';


/**
 * @swagger
 * tags:
 *   name: Client
 *   description: Endpoints para gestión de clientes
 */
const router = Router();

/**
 * @swagger
 * /api/client:
 *   post:
 *     summary: Crear un cliente
 *     tags: [Client]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Client'
 *           example:
 *             name: Cliente Ejemplo
 *             cif: B12345678
 *             email: cliente@email.com
 *             address:
 *               street: Calle Falsa
 *               number: "123"
 *               postal: "28003"
 *               city: Madrid
 *               province: Madrid
 *     responses:
 *       201:
 *         description: Cliente creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       409:
 *         description: Cliente con ese CIF ya existe
 */
router.post('/', auth, validate(createClientSchema), clientController.createClient);
/**
 * @swagger
 * /api/client:
 *   get:
 *     summary: Listar todos los clientes
 *     tags: [Client]
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
 *         name: name
 *         schema:
 *           type: string
 *         description: Búsqueda parcial por nombre
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: "Ordenación (ejemplo: createdAt)"
 *     responses:
 *       200:
 *         description: Lista de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clients:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Client'
 *                 totalItems:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *       401:
 *         description: No autorizado
 */
router.get('/', auth, clientController.getClients);
/**
 * @swagger
 * /api/client/archived:
 *   get:
 *     summary: Listar clientes archivados
 *     tags: [Client]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes archivados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Client'
 *       401:
 *         description: No autorizado
 */
router.get('/archived', auth, clientController.getArchivedClients);
/**
 * @swagger
 * /api/client/{id}:
 *   get:
 *     summary: Obtener un cliente concreto
 *     tags: [Client]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Cliente no encontrado
 */
router.get('/:id', auth, validate(clientIdParamSchema, 'params'), checkClientExists, clientController.getClientById);
/**
 * @swagger
 * /api/client/{id}:
 *   put:
 *     summary: Actualizar un cliente
 *     tags: [Client]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Client'
 *           example:
 *             name: Cliente Actualizado
 *             cif: B87654321
 *             email: nuevo@email.com
 *             address:
 *               street: Calle Nueva
 *               number: "456"
 *               postal: "28004"
 *               city: Madrid
 *               province: Madrid
 *     responses:
 *       200:
 *         description: Cliente actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Cliente no encontrado
 */
router.put('/:id', auth, validate(clientIdParamSchema, 'params'), validate(updateClientSchema), checkClientExists, checkClientNotArchived, clientController.updateClient);
/**
 * @swagger
 * /api/client/{id}:
 *   delete:
 *     summary: Archivar (soft) o borrar (hard) un cliente
 *     tags: [Client]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *       - in: query
 *         name: soft
 *         schema:
 *           type: boolean
 *         description: Si es true, archiva; si es false, borra definitivamente
 *     responses:
 *       200:
 *         description: Cliente archivado o borrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Cliente no encontrado
 */
router.delete('/:id', auth, validate(clientIdParamSchema, 'params'), checkClientExists, clientController.deleteClient);
/**
 * @swagger
 * /api/client/{id}/restore:
 *   patch:
 *     summary: Restaurar un cliente archivado
 *     tags: [Client]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente restaurado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Cliente no encontrado o no archivado
 */
router.patch('/:id/restore', auth, validate(clientIdParamSchema, 'params'), checkClientExists, clientController.restoreClient);

export default router;
