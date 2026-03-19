import Podcast from "../models/podcast.model";
import { handleHttpError } from "../utils/handleError";

const PUBLIC_URL = process.env.PUBLIC_URL
/*
	Público	Listar podcasts publicados
	Público	Obtener un podcast
POST	/api/podcasts	Autenticado	Crear podcast
PUT	/api/podcasts/:id	Autenticado (autor)	Actualizar propio podcast
DELETE	/api/podcasts/:id	Admin	Eliminar cualquier podcast
GET	/api/podcasts/admin/all	Admin	Listar todos (incluye no publicados)
PATCH	/api/podcasts/:id/publish	Admin	Publicar/despublicar
*/

// GET	/api/podcasts
export const getPodcasts = async (req, res) => {
    res.json({ data: await Podcast.find({ published: true }) });
}

// GET	/api/podcasts/:id
export const getPodcast = async (req, res) => {
    const podcast = await Podcast.findById(req.params.id);
    if (!podcast || !podcast.published) {
        return handleHttpError(res, 'Podcast no encontrado', 404);
    }
    res.json({ data: podcast });
}

// POST	/api/podcasts
export const createPodcast = async (req, res) => {
    const podcast = await Podcast.create(req.body);
    res.status(201).json({ data: podcast });
};

// PUT	/api/podcasts/:id
export const updatePodcast = async (req, res) => {
    const podcast = await Podcast.findById(req.params.id);
    if (!podcast) {
        return handleHttpError(res, 'Podcast no encontrado', 404);
    }
    res.status(200).json({ data: podcast });
};

// DELETE	/api/podcasts/:id
export const deletePodcast = async (req, res) => {
    const podcast = await Podcast.findById(req.params.id);

    if (!podcast) {
        return handleHttpError(res, 'Podcast no encontrado', 404);
    }

    res.status(204).send();
}

// GET	/api/podcasts/admin/all
export const getAllPodcasts = async (req, res) => {
    res.json({ data: await Podcast.find() });
}

// PATCH	/api/podcasts/:id/publish	Admin	Publicar/despublicar
export const publishPodcast = async (req, res) => {
    const podcast = await Podcast.findById(req.params.id);
    if (!podcast) {
        return handleHttpError(res, 'Podcast no encontrado', 404);
    }
    podcast.published = !podcast.published;
    await podcast.save();
    res.json({ data: podcast });
}
/*
  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  
  if (!movie) {
    return handleHttpError(res, 'Película no encontrado', 404);
  }
  
  res.json({ data: movie });
*/