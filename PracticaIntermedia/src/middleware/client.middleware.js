// src/middleware/client.middleware.js
import Client from '../models/Client.js';
import { AppError } from '../utils/AppError.js';

export async function checkClientExists(req, res, next) {
  const { id } = req.params;
  const client = await Client.findOne({ _id: id, company: req.user.company });
  if (!client) return next(new AppError('Cliente no encontrado', 404));
  req.client = client;
  next();
}

export async function checkClientNotArchived(req, res, next) {
  if (req.client.archived) return next(new AppError('Cliente archivado', 400));
  next();
}
