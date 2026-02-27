import Movie from '../models/movie.model.js';
import { handleHttpError } from '../utils/handleError.js';

const PUBLIC_URL = process.env.PUBLIC_URL || 'http://localhost:3000';

// GET /api/movies
export const getMovies = async (req, res) => {
  const { page = 1, limit = 10, genre } = req.query;
  
  // Filtro dinámico
  const filter = {};
  if (genre) filter.genre = genre;
  
  const skip = (Number(page) - 1) * Number(limit);
  
  const [movies, total] = await Promise.all([
    Movie.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 }),
    Movie.countDocuments(filter)
  ]);
  
  res.json({
    data: movies,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit))
    }
  });
};

// GET /api/movies/:id
export const getMovie = async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  
  if (!movie) {
    return handleHttpError(res, 'Película no encontrada', 404);
  }
  
  res.json({ data: movie });
};

// POST /api/movies
export const createMovie = async (req, res) => {
  const movie = await Movie.create(req.body);
  res.status(201).json({ data: movie });
};

// PATCH /api/movies/:id
export const updateMovie = async (req, res) => {
  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  
  if (!movie) {
    return handleHttpError(res, 'Película no encontrado', 404);
  }
  
  res.json({ data: movie });
};

// DELETE /api/movie/:id
export const deleteMovie = async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  
  if (!movie) {
    return handleHttpError(res, 'Película no encontrado', 404);
  }
  
  res.status(204).send();
};

export const rentMovie = async (req,res) => {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return handleHttpError(res, 'Película no encontrada', 404);
    }

    // reducir el numero de copias disponibles y de las veces que ha sido rentado
    movie.availableCopies -= 1;
    movie.timesRented += 1;

    res.status(200).json({ data: movie });
}

export const returnMovie = async (req,res) => {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return handleHttpError(res, 'Película no encontrada', 404);
    }

    // aumentar el numero de copias disponibles
    movie.availableCopies += 1;

    res.status(200).json({ data: movie });
}

export const uploadCover = async (req,res) => {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return handleHttpError(res, 'Película no encontrada', 404);
    }

    movie.cover = req.file.filename;
    res.status(200).json({ data: movie });
}

export const getCover = async (req,res) => {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return handleHttpError(res, 'Película no encontrada', 404);
    }

    res.status(200).sendFile(movie.cover);
}

export const topMovies = async (req,res) => {
    const movies = await Movie.find().sort({ timesRented: -1 }).limit(5);
    res.json({ data: movies });
}