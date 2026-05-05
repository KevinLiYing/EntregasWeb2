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


export async function updateProject(id, data, user) {
  const project = await Project.findOneAndUpdate(
    { _id: id, company: user.company },
    data,
    { new: true }
  );
  if (!project) throw new AppError('Proyecto no encontrado', 404);
  return project;
}

export async function getProjects(query, user) {
  const { page = 1, limit = 10, client, name, active, sort = 'createdAt' } = query;
  const filter = { company: user.company };
  if (client) filter.client = client;
  if (name) filter.name = { $regex: name, $options: 'i' };
  if (active !== undefined) filter.active = active === 'true';
  const totalItems = await Project.countDocuments(filter);
  const projects = await Project.find(filter)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(Number(limit));
  return {
    projects,
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
    currentPage: Number(page)
  };
}

export async function getProjectById(id, user) {
  const project = await Project.findOne({ _id: id, company: user.company });
  if (!project) throw new AppError('Proyecto no encontrado', 404);
  return project;
}

export async function deleteProject(id, user, soft = true) {
  const project = await Project.findOne({ _id: id, company: user.company });
  if (!project) throw new AppError('Proyecto no encontrado', 404);
  if (soft) {
    project.archived = true;
    await project.save();
    return project;
  } else {
    await project.deleteOne();
    return null;
  }
}

export async function getArchivedProjects(user) {
  return Project.find({ company: user.company, archived: true });
}

export async function restoreProject(id, user) {
  const project = await Project.findOne({ _id: id, company: user.company, archived: true });
  if (!project) throw new AppError('Proyecto no encontrado o no archivado', 404);
  project.archived = false;
  await project.save();
  return project;
}
