import { z } from 'zod';

export const createTareasSchema = z.object({
  body: z.object({
    titulo: z.string()
      .min(3, 'El título debe tener al menos 3 caracteres')
      .max(100, 'El título no puede exceder 100 caracteres'),
      prioridad: z.enum(['low', 'medium', 'high']),
      dueDate: z.string().optional(),
    tags: z.array(z.string())
    .max(5, "No puede haber más de 5 tags")
  })
});

// actualmente esta todo en opcional
export const updateTareasSchema = z.object({
  body: z.object({
    titulo: z.string().min(3).max(100).optional(),
    prioridad: z.enum(['low', 'medium', 'high']).optional(),
    dueDate: z.string().optional(),
    tags: z.array(z.string()).optional()
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID debe ser numérico')
  })
});