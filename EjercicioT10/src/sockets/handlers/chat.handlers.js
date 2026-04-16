import Message from '../../models/message.model.js';
import Room from '../../models/room.model.js';

export function chatHandler(io, socket) {
	// Unirse a una sala y enviar historial
	socket.on('room:join', async ({ roomId }) => {
		socket.join(roomId);
		// Obtener historial de mensajes
		const messages = await Message.find({ room: roomId })
			.sort({ createdAt: 1 })
			.populate('user', 'name avatar');
		// Obtener usuarios en sala
		const sockets = await io.in(roomId).fetchSockets();
		const users = sockets.map(s => s.user);
		socket.emit('room:joined', { room: roomId, users, messages });
		socket.to(roomId).emit('room:user-joined', { user: socket.user });
	});

	// Salir de sala
	socket.on('room:leave', ({ roomId }) => {
		socket.leave(roomId);
		socket.to(roomId).emit('room:user-left', { user: socket.user });
	});

	// Enviar mensaje
	socket.on('chat:message', async ({ roomId, content }) => {
		const message = await Message.create({
			room: roomId,
			user: socket.user.id,
			content
		});
		const populated = await message.populate('user', 'name avatar');
		io.to(roomId).emit('chat:message', {
			user: populated.user,
			content: populated.content,
			timestamp: populated.createdAt
		});
	});

	// Indicador escribiendo
	socket.on('chat:typing', ({ roomId }) => {
		socket.to(roomId).emit('chat:typing', { user: socket.user });
	});

	socket.on('chat:stopTyping', ({ roomId }) => {
		socket.to(roomId).emit('chat:stopTyping', { user: socket.user });
	});

	// Presencia online/offline
	socket.on('disconnecting', () => {
		for (const roomId of socket.rooms) {
			if (roomId !== socket.id) {
				socket.to(roomId).emit('user:offline', { userId: socket.user.id });
			}
		}
	});
}
