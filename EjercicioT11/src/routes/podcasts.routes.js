import { Router } from 'express';
import * as controller from '../controllers/podcasts.controller.js';
import { validatePodcast, validateObjectId } from '../middleware/validate.middleware.js';
import session from '../middleware/session.middleware.js';
import requireRole from '../middleware/rol.middleware.js';
import { podcastSchema } from '../validators/podcast.validator.js';

const router = Router();


/**
 * @swagger
 * /api/podcasts:
 *   get:
 *     summary: Listar podcasts publicados
 *     tags: [Podcasts]
 *     responses:
 *       200:
 *         description: Lista de podcasts publicados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Podcast'
 */
router.get('/', controller.getPodcasts);

/**
 * @swagger
 * /api/podcasts/{id}:
 *   get:
 *     summary: Obtener un podcast
 *     tags: [Podcasts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Podcast encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Podcast'
 *       404:
 *         description: Podcast no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', validateObjectId(), controller.getPodcast);

/**
 * @swagger
 * /api/podcasts:
 *   post:
 *     summary: Crear podcast
 *     tags: [Podcasts]
 *     security:
 *       - BearerToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Podcast'
 *     responses:
 *       201:
 *         description: Podcast creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Podcast'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', session, validatePodcast, controller.createPodcast);

/**
 * @swagger
 * /api/podcasts/{id}:
 *   put:
 *     summary: Actualizar podcast propio
 *     tags: [Podcasts]
 *     security:
 *       - BearerToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Podcast'
 *     responses:
 *       200:
 *         description: Podcast actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Podcast'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Podcast no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', session, validateObjectId(), validatePodcast, controller.updatePodcast);

/**
 * @swagger
 * /api/podcasts/{id}:
 *   delete:
 *     summary: Eliminar podcast (admin)
 *     tags: [Podcasts]
 *     security:
 *       - BearerToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Podcast eliminado
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Prohibido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', session, requireRole('admin'), validateObjectId(), controller.deletePodcast);

/**
 * @swagger
 * /api/podcasts/admin/all:
 *   get:
 *     summary: Listar todos los podcasts (admin)
 *     tags: [Podcasts]
 *     security:
 *       - BearerToken: []
 *     responses:
 *       200:
 *         description: Lista de todos los podcasts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Podcast'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Prohibido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/admin/all', session, requireRole('admin'), controller.getAllPodcasts);

/**
 * @swagger
 * /api/podcasts/{id}/publish:
 *   patch:
 *     summary: Publicar/despublicar podcast (admin)
 *     tags: [Podcasts]
 *     security:
 *       - BearerToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estado de publicación actualizado
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Prohibido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/:id/publish', session, requireRole('admin'), validateObjectId(), controller.publishPodcast);

export default router;