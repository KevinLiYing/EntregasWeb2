// src/routes/deliverynote.routes.js
import { Router } from 'express';
import * as deliveryNoteController from '../controllers/deliverynote.controller.js';
import { validate } from '../middleware/validate.js';
import { createDeliveryNoteSchema, deliveryNoteIdParamSchema } from '../validators/deliverynote.validator.js';
import { checkDeliveryNoteExists, checkDeliveryNoteNotSigned } from '../middleware/deliverynote.middleware.js';
import { auth } from '../middleware/auth.middleware.js';


/**
 * @swagger
 * tags:
 *   name: DeliveryNote
 *   description: Endpoints para gestión de albaranes
 */
const router = Router();

/**
 * @swagger
 * /api/deliverynote:
 *   post:
 *     summary: Crear un albarán
 *     tags: [DeliveryNote]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeliveryNote'
 *           example:
 *             project: 6634e7b2f1a2b2c1d2e3f4a8
 *             format: material
 *             entries:
 *               - material: Cemento
 *                 quantity: 10
 *                 description: Entrega de material
 *             workDate: 2026-05-03
 *     responses:
 *       201:
 *         description: Albarán creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeliveryNote'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Proyecto no encontrado
 */
router.post('/', auth, validate(createDeliveryNoteSchema), deliveryNoteController.createDeliveryNote);
/**
 * @swagger
 * /api/deliverynote:
 *   get:
 *     summary: Listar albaranes
 *     tags: [DeliveryNote]
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
 *         name: project
 *         schema:
 *           type: string
 *         description: Filtrar por ID de proyecto
 *       - in: query
 *         name: client
 *         schema:
 *           type: string
 *         description: Filtrar por ID de cliente
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *         description: Filtrar por formato (material/hours)
 *       - in: query
 *         name: signed
 *         schema:
 *           type: boolean
 *         description: Filtrar por firmados
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha inicio
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha fin
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: "Ordenación (ejemplo: workDate)"
 *     responses:
 *       200:
 *         description: Lista de albaranes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deliveryNotes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DeliveryNote'
 *                 totalItems:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *       401:
 *         description: No autorizado
 */
router.get('/', auth, deliveryNoteController.getDeliveryNotes);
/**
 * @swagger
 * /api/deliverynote/{id}:
 *   get:
 *     summary: Obtener un albarán concreto
 *     tags: [DeliveryNote]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del albarán
 *     responses:
 *       200:
 *         description: Albarán encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeliveryNote'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Albarán no encontrado
 */
router.get('/:id', auth, validate(deliveryNoteIdParamSchema, 'params'), checkDeliveryNoteExists, deliveryNoteController.getDeliveryNoteById);
/**
 * @swagger
 * /api/deliverynote/pdf/{id}:
 *   get:
 *     summary: Descargar albarán en PDF
 *     tags: [DeliveryNote]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del albarán
 *     responses:
 *       302:
 *         description: Redirección al PDF
 *       401:
 *         description: No autorizado
 *       404:
 *         description: PDF no disponible
 */
router.get('/pdf/:id', auth, validate(deliveryNoteIdParamSchema, 'params'), checkDeliveryNoteExists, deliveryNoteController.downloadPDF);
/**
 * @swagger
 * /api/deliverynote/{id}/sign:
 *   patch:
 *     summary: Firmar un albarán
 *     tags: [DeliveryNote]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del albarán
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               signatureUrl:
 *                 type: string
 *                 example: https://firma.com/firma.png
 *     responses:
 *       200:
 *         description: Albarán firmado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeliveryNote'
 *       400:
 *         description: Faltan datos o ya está firmado
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Albarán no encontrado
 */
router.patch('/:id/sign', auth, validate(deliveryNoteIdParamSchema, 'params'), checkDeliveryNoteExists, checkDeliveryNoteNotSigned, deliveryNoteController.signDeliveryNote);
/**
 * @swagger
 * /api/deliverynote/{id}:
 *   delete:
 *     summary: Borrar un albarán
 *     tags: [DeliveryNote]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del albarán
 *     responses:
 *       204:
 *         description: Albarán borrado
 *       400:
 *         description: No se puede borrar un albarán firmado
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Albarán no encontrado
 */
router.delete('/:id', auth, validate(deliveryNoteIdParamSchema, 'params'), checkDeliveryNoteExists, checkDeliveryNoteNotSigned, deliveryNoteController.deleteDeliveryNote);

export default router;
