// src/services/client.service.js
import Client from '../models/Client.js';
import AppError from '../utils/AppError.js';
import { notifyClientNew } from './socket.service.js';

export async function createClient(data, user) {
  const exists = await Client.findOne({ cif: data.cif, company: user.company });
  if (exists) throw new AppError('Ya existe un cliente con ese CIF', 409);
  const client = await Client.create({ ...data, user: user._id, company: user.company });
  notifyClientNew(user.company, client);
  return client;
}

// ...otros métodos (getClients, updateClient, etc.)
