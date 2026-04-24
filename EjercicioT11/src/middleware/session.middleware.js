import jwt from 'jsonwebtoken';
import { handleHttpError } from '../utils/handleError.js';
import User from '../models/user.model.js';

/**
 * Middleware de sesión para autenticar usuarios por JWT
 */
const sessionMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return handleHttpError(res, 'NO_TOKEN', 401);
    }
    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return handleHttpError(res, 'INVALID_TOKEN', 401);
    }
    const user = await User.findById(decoded.userId);
    if (!user) {
      return handleHttpError(res, 'USER_NOT_FOUND', 401);
    }
    req.user = user;
    next();
  } catch (err) {
    handleHttpError(res, 'SESSION_ERROR', 401);
  }
};

export default sessionMiddleware;
