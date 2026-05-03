// src/controllers/project.controller.js
import * as projectService from '../services/project.service.js';

export async function createProject(req, res, next) {
  try {
    const project = await projectService.createProject(req.body, req.user);
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
}

export async function getProjects(req, res, next) {
  try {
    const result = await projectService.getProjects(req.query, req.user);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getProjectById(req, res, next) {
  try {
    res.json(req.project);
  } catch (err) {
    next(err);
  }
}

export async function updateProject(req, res, next) {
  try {
    const project = await projectService.updateProject(req.params.id, req.body, req.user);
    res.json(project);
  } catch (err) {
    next(err);
  }
}

export async function deleteProject(req, res, next) {
  try {
    const soft = req.query.soft !== 'false';
    const result = await projectService.deleteProject(req.params.id, req.user, soft);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getArchivedProjects(req, res, next) {
  try {
    const projects = await projectService.getArchivedProjects(req.user);
    res.json(projects);
  } catch (err) {
    next(err);
  }
}

export async function restoreProject(req, res, next) {
  try {
    const project = await projectService.restoreProject(req.params.id, req.user);
    res.json(project);
  } catch (err) {
    next(err);
  }
}
