// src/middleware/project.middleware.js
import Project from '../models/Project.js';
import AppError from '../utils/AppError.js';

export async function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = await Project.findOne({ _id: id, company: req.user.company });
  if (!project) return next(new AppError('Proyecto no encontrado', 404));
  req.project = project;
  next();
}

export async function checkProjectNotArchived(req, res, next) {
  if (req.project.archived) return next(new AppError('Proyecto archivado', 400));
  next();
}
