import { z } from 'zod';

export const podcastSchema = z.object({
	title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
	description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
	author: z.string().min(1, 'El autor es requerido'),
	category: z.enum(['tech', 'science', 'history', 'comedy', 'news']).optional(),
	duration: z.number().min(60, 'La duración mínima es 60 segundos'),
	episodes: z.number().int().min(1).optional(),
	published: z.boolean().optional()
});

// Middleware para validar creación de podcast
export const validatePodcast = (req, res, next) => {
	try {
		podcastSchema.parse(req.body);
		next();
	} catch (err) {
		res.status(400).json({ error: true, message: err.errors?.[0]?.message || 'Datos inválidos' });
	}
};
