/**
 * Middleware de validación con Zod
 */

import { ZodError } from 'zod';

export const validate = (schema, source = 'body') => async (req, res, next) => {
  try {
    let data;

    switch (source) {
      case 'params':
        data = req.params;
        break;
      case 'query':
        data = req.query;
        break;
      default:
        data = req.body;
    }

    await schema.parseAsync(data);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const issues = error.issues || [];

      return res.status(400).json({
        error: 'Error de validación',
        detalles: issues.map(err => ({
          campo: err.path?.join('.') || '',
          mensaje: err.message
        }))
      });
    }

    next(error);
  }
};