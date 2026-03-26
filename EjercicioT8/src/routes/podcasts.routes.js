/*
GET    /api/podcasts            Público         Listar podcasts publicados
GET    /api/podcasts/:id        Público         Obtener un podcast
POST   /api/podcasts            Autenticado     Crear podcast
PUT    /api/podcasts/:id        Autenticado     (autor) Actualizar propio podcast
DELETE /api/podcasts/:id        Admin           Eliminar cualquier podcast
GET    /api/podcasts/admin/all  Admin           Listar todos (incluye no publicados)
PATCH  /api/podcasts/:id/publish Admin          Publicar/despublicar
*/
import { Router } from 'express';
import * as controller from '../controllers/podcasts.controller.js';
import { validate, validateObjectId } from '../middleware/validate.middleware.js';
import session from '../middleware/session.middleware.js';
import requireRole from '../middleware/rol.middleware.js';
// import { createPodcastSchema, updatePodcastSchema } from '../validators/podcast.validator.js';

const router = Router();

//GET    /api/podcasts
router.get('/', controller.getPodcasts);
//GET    /api/podcasts/:id
router.get('/:id', validateObjectId(), controller.getPodcast);
//POST   /api/podcasts
router.post('/', session, /*validate(createPodcastSchema),*/ controller.createPodcast);
//PUT    /api/podcasts/:id
router.put('/:id', session, validateObjectId(), /*validate(updatePodcastSchema),*/ controller.updatePodcast);
//DELETE /api/podcasts/:id
router.delete('/:id', session, requireRole('admin'), validateObjectId(), controller.deletePodcast);
//GET    /api/podcasts/admin/all
router.get('/admin/all', session, requireRole('admin'), controller.getAllPodcasts);
//PATCH  /api/podcasts/:id/publish
router.patch('/:id/publish', session, requireRole('admin'), validateObjectId(), controller.publishPodcast);

export default router;