import { z } from 'zod';

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'ID no válido');

export const createMovieSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: 'El título es requerido' })
      .min(2, 'Mínimo 2 caracteres'),
    director: z
      .string({ required_error: 'El director es requerido' }),
    year: z
      .number({ required_error: 'El año es requerido' })
      .min(1888, 'Año no válido'),
    genre: z
      .string({ required_error: 'El género es requerido' })
      .enum(['action', 'comedy', 'drama', 'horror', 'scifi']),
    copies: z
      .number()
      .int('Debe ser un número entero')
      .min(0, 'No puede ser negativo')
      .default(5),
    availableCopies: z
      .number()
      .int('Debe ser un número entero')
      .min(0, 'No puede ser negativo')
      .default(5),
    timesRented: z
      .number()
      .int('Debe ser un número entero')
      .min(0, 'No puede ser negativo')
      .default(0),
      // 
    cover: z.string().optional().nullable(),
  })
});

export const updateMovieSchema = z.object({
  params: z.object({
    id: objectIdSchema
  }),
  body: z.object({
    title: z
      .string()
      .min(2, 'Mínimo 2 caracteres').optional(),
    director: z
      .string().optional(),
    year: z
      .number().min(1888, 'Año no válido').optional(),
    genre: z
      .string()
      .enum(['action', 'comedy', 'drama', 'horror', 'scifi']).optional(),
    copies: z
      .number().int().min(0).optional(),
    availableCopies: z
      .number().int().min(0).optional(),
    timesRented: z.number().int().min(0).optional(),
    cover: z.string().url().optional().nullable(),
  }).refine(
    (data) => Object.keys(data).length > 0,
    { message: 'Debe proporcionar al menos un campo' }
  )
});

export const getMovieSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
});