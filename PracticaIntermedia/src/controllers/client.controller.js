// src/controllers/client.controller.js
import * as clientService from '../services/client.service.js';

export async function createClient(req, res, next) {
  try {
    const client = await clientService.createClient(req.body, req.user);
    res.status(201).json(client);
  } catch (err) {
    next(err);
  }
}

export async function getClients(req, res, next) {
  try {
    const result = await clientService.getClients(req.query, req.user);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getClientById(req, res, next) {
  try {
    res.json(req.client);
  } catch (err) {
    next(err);
  }
}

export async function updateClient(req, res, next) {
  try {
    const client = await clientService.updateClient(req.params.id, req.body, req.user);
    res.json(client);
  } catch (err) {
    next(err);
  }
}

export async function deleteClient(req, res, next) {
  try {
    const soft = req.query.soft !== 'false';
    const result = await clientService.deleteClient(req.params.id, req.user, soft);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getArchivedClients(req, res, next) {
  try {
    const clients = await clientService.getArchivedClients(req.user);
    res.json(clients);
  } catch (err) {
    next(err);
  }
}

export async function restoreClient(req, res, next) {
  try {
    const client = await clientService.restoreClient(req.params.id, req.user);
    res.json(client);
  } catch (err) {
    next(err);
  }
}
