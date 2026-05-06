export class AppError extends Error {
  constructor(message, statusCode = 500, code = null, details = []) {
    super(message);

    this.statusCode = statusCode;
    this.code = code;
    this.details = Array.isArray(details) && details.length ? details : undefined;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(
    message = 'Solicitud inválida',
    code = 'BAD_REQUEST',
    details = []
  ) {
    return new AppError(message, 400, code, details);
  }

  static unauthorized(
    message = 'No autorizado',
    code = 'UNAUTHORIZED'
  ) {
    return new AppError(message, 401, code);
  }

  static forbidden(
    message = 'Acceso prohibido',
    code = 'FORBIDDEN'
  ) {
    return new AppError(message, 403, code);
  }

  static notFound(
    resource = 'Recurso',
    code = 'NOT_FOUND'
  ) {
    return new AppError(`${resource} no encontrado`, 404, code);
  }

  static conflict(
    message = 'Conflicto con recurso existente',
    code = 'CONFLICT',
    details = []
  ) {
    return new AppError(message, 409, code, details);
  }

  static validation(
    message = 'Error de validación',
    details = [],
    code = 'VALIDATION_ERROR'
  ) {
    return new AppError(message, 400, code, details);
  }

  static tooManyRequests(
    message = 'Demasiadas peticiones',
    code = 'RATE_LIMIT'
  ) {
    return new AppError(message, 429, code);
  }

  static internal(
    message = 'Error interno del servidor',
    code = 'INTERNAL_ERROR'
  ) {
    return new AppError(message, 500, code);
  }
}