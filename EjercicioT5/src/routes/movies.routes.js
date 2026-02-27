// src/routes/users.routes.js
import { Router } from 'express';
import uploadMiddleware from '../utils/handleStorage.js';
import {
  getMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
  rentMovie,
  returnMovie,
  uploadCover,
  topMovies,
  getAvailableMovies
} from '../controllers/movies.controller.js';
import { validate, validateObjectId } from '../middleware/validate.middleware.js';
import { createMovieSchema, updateMovieSchema, getMovieSchema } from '../schemas/movie.schema.js';

const router = Router();

router.get('/', getMovies);
router.get('/:id', validateObjectId(), getMovie);
router.post('/', validate(createMovieSchema), createMovie);
router.patch('/:id', validate(updateMovieSchema), updateMovie);
router.delete('/:id', validateObjectId(), deleteMovie);
router.put('/:id/rent', rentMovie);
router.put('/:id/return', returnMovie);
router.post('/:id/cover', uploadMiddleware.single('cover'), uploadCover);
router.get('/top', topMovies);
router.get('/available', getAvailableMovies);

export default router;