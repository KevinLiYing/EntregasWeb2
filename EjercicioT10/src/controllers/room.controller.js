import Room from '../models/room.model.js';
import Message from '../models/message.model.js';

// Listar salas
export async function listRooms(req, res) {
  const rooms = await Room.find().select('-users');
  res.json(rooms);
}

// Crear sala
export async function createRoom(req, res) {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ message: 'Nombre requerido' });
  try {
    const room = await Room.create({ name, description });
    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Historial de mensajes de una sala
export async function getRoomMessages(req, res) {
  const { id } = req.params;
  const messages = await Message.find({ room: id })
    .sort({ createdAt: 1 })
    .populate('user', 'name avatar');
  res.json(messages);
}
