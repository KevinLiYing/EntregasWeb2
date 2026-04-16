import { Router } from 'express';

import { listRooms, createRoom, getRoomMessages } from '../controllers/room.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();


// Listar salas
router.get('/rooms', authMiddleware, listRooms);
// Crear sala
router.post('/rooms', authMiddleware, createRoom);
// Historial de mensajes de una sala
router.get('/rooms/:id/messages', authMiddleware, getRoomMessages);

export default router;
