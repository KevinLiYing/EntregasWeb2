// Middleware para autorización basada en roles
// Uso: router.use(auth, requireRole('admin'))
export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Acceso prohibido: rol insuficiente' });
  }
  next();
};