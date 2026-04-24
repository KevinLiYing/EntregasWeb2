// src/middleware/validate.middleware.js
import { validatePodcast } from '../validators/podcast.validator.js';
import { validateRegister, validateLogin } from '../validators/auth.validator.js';
import mongoose from 'mongoose';

export function validate(schema) {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      res.status(400).json({ error: true, message: err.errors?.[0]?.message || 'Datos inválidos' });
    }
  };
}

export function validateObjectId() {
  return (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: true, message: 'ID inválido' });
    }
    next();
  };
}

export { validatePodcast, validateRegister, validateLogin };
