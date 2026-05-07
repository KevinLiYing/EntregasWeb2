import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';

import User from '../models/User.js';

export const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next(AppError.unauthorized('Token no proporcionado'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload?.id) {
      return next(AppError.unauthorized('Token inválido'));
    }

    // Buscar el usuario en la base de datos para obtener company y role actualizados
    const user = await User.findById(payload.id);
    if (!user) {
      return next(AppError.unauthorized('Usuario no encontrado'));
    }
    req.user = {
      _id: user._id,
      email: user.email,
      role: user.role,
      company: user.company
    };
    next();
  } catch (err) {
    return next(AppError.unauthorized('Token inválido o expirado'));
  }
};