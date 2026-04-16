import { Router } from 'express';
import Room from '../models/room.model.js';
import Message from '../models/message.model.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// Listar salas
router.get('/rooms', authMiddleware, async (req, res) => {
	const rooms = await Room.find().select('-users');
	res.json(rooms);
});

// Crear sala
router.post('/rooms', authMiddleware, async (req, res) => {
	const { name, description } = req.body;
	if (!name) return res.status(400).json({ message: 'Nombre requerido' });
	try {
		const room = await Room.create({ name, description });
		res.status(201).json(room);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// Historial de mensajes de una sala
router.get('/rooms/:id/messages', authMiddleware, async (req, res) => {
	const { id } = req.params;
	const messages = await Message.find({ room: id })
		.sort({ createdAt: 1 })
		.populate('user', 'name avatar');
	res.json(messages);
});

export default router;
