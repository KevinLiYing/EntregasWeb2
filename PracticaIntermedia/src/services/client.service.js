// src/services/client.service.js
import Client from '../models/Client.js';
import { AppError } from '../utils/AppError.js';
import { notifyClientNew } from './socket.service.js';

export async function createClient(data, user) {
  if (!user.company) {
    throw new AppError('Debes completar el onboarding de compañía antes de crear clientes', 400);
  }
  const exists = await Client.findOne({ cif: data.cif, company: user.company });
  if (exists) throw new AppError('Ya existe un cliente con ese CIF', 409);
  const client = await Client.create({ ...data, user: user.id, company: user.company });
  notifyClientNew(user.company, client);
  return client;
}


export async function updateClient(id, data, user) {
  const client = await Client.findOneAndUpdate(
    { _id: id, company: user.company },
    data,
    { returnDocument: 'after' }
  );
  if (!client) throw new AppError('Cliente no encontrado', 404);
  return client;
}

export async function getClients(query, user) {
  const { page = 1, limit = 10, name, sort = 'createdAt' } = query;
  const filter = { company: user.company };
  if (name) filter.name = { $regex: name, $options: 'i' };
  const totalItems = await Client.countDocuments(filter);
  const clients = await Client.find(filter)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(Number(limit));
  return {
    clients,
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
    currentPage: Number(page)
  };
}

export async function getClientById(id, user) {
  const client = await Client.findOne({ _id: id, company: user.company });
  if (!client) throw new AppError('Cliente no encontrado', 404);
  return client;
}

export async function deleteClient(id, user, soft = true) {
  const client = await Client.findOne({ _id: id, company: user.company });
  if (!client) throw new AppError('Cliente no encontrado', 404);
  if (soft) {
    client.archived = true;
    await client.save();
    return client;
  } else {
    await client.deleteOne();
    return null;
  }
}

export async function getArchivedClients(user) {
  return Client.find({ company: user.company, archived: true });
}

export async function restoreClient(id, user) {
  const client = await Client.findOne({ _id: id, company: user.company, archived: true });
  if (!client) throw new AppError('Cliente no encontrado o no archivado', 404);
  client.archived = false;
  await client.save();
  return client;
}
