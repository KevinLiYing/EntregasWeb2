// src/sockets/index.js
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export function setupSocket(server) {
  const io = new Server(server, {
    cors: { origin: '*' }
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) return next(new Error('No token provided'));
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = payload;
      socket.join(payload.company); // Únete al room de la compañía
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    // Puedes agregar logs o listeners personalizados aquí
  });

  return io;
}

// Helpers para emitir eventos
export function emitToCompany(io, companyId, event, data) {
  io.to(companyId).emit(event, data);
}
