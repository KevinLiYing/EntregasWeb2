import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';

export const auth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(AppError.unauthorized('Token no proporcionado'));
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return next(AppError.unauthorized('Token inválido o expirado'));
  }
};
