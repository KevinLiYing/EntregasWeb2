// src/services/project.service.js
import Project from '../models/Project.js';
import Client from '../models/Client.js';
import AppError from '../utils/AppError.js';
import { notifyProjectNew } from './socket.service.js';

export async function createProject(data, user) {
  const client = await Client.findOne({ _id: data.client, company: user.company });
  if (!client) throw new AppError('Cliente no encontrado', 404);
  const exists = await Project.findOne({ code: data.code, company: user.company });
  if (exists) throw new AppError('Ya existe un proyecto con ese código', 409);
  const project = await Project.create({ ...data, user: user._id, company: user.company });
  notifyProjectNew(user.company, project);
  return project;
}

// ...otros métodos (getProjects, updateProject, etc.)
