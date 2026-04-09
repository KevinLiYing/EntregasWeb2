import { verifyToken } from '../utils/jwt.js';



// Middleware para requerir autenticación
export function authRequired(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: true, message: 'Token requerido' });
  }
  const token = auth.split(' ')[1];
  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: true, message: 'Token inválido' });
  }
}

// Middleware para requerir uno o varios roles
export function requireRole(roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: true, message: 'No tienes permisos' });
    }
    next();
  };
}
