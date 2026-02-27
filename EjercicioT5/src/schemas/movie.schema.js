import { z } from 'zod';

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'ID no válido');

  // no me iban poniendolo directamente
const genreEnum = z.enum(['action', 'comedy', 'drama', 'horror', 'scifi']);

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
    genre: genreEnum,
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
    rating: z
      .number()
      .min(0, 'El rating mínimo es 0')
      .max(5, 'El rating máximo es 5')
      .default(0)
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
    genre: genreEnum.optional(),
    copies: z
      .number().int().min(0).optional(),
    availableCopies: z
      .number().int().min(0).optional(),
    timesRented: z.number().int().min(0).optional(),
    cover: z.string().url().optional().nullable(),
    rating: z
      .number()
      .min(0, 'El rating mínimo es 0')
      .max(5, 'El rating máximo es 5')
      .optional(),
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