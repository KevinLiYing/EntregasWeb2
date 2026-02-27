// src/routes/users.routes.js
import { Router } from 'express';
import {
  getMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
  rentMovie,
  returnMovie,
  uploadCover,
  topMovies
} from '../controllers/movies.controller.js';
import { validate, validateObjectId } from '../middleware/validate.middleware.js';
import { createMovieSchema, updateMovieSchema, getMovieSchema } from '../schemas/user.schema.js';

const router = Router();

router.get('/', getMovies);
router.get('/:id', validateObjectId(), getMovie);
router.post('/', validate(createMovieSchema), createMovie);
router.put('/:id', validate(updateMovieSchema), updateMovie);
router.delete('/:id', validateObjectId(), deleteMovie);
router.put('/:id/rent', rentMovie);
router.put('/:id/return', returnMovie);
router.post('/:id/upload-cover', uploadCover);
router.get('/top', topMovies);

export default router;