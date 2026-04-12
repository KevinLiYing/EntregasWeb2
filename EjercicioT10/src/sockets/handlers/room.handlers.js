import Room from '../../models/room.model.js';

export function roomHandler(io, socket) {
	// Crear nueva sala
	socket.on('room:create', async ({ name, description }) => {
		try {
			const room = await Room.create({ name, description });
			io.emit('room:created', room);
		} catch (error) {
			socket.emit('room:error', { message: error.message });
		}
	});

	// Listar salas disponibles
	socket.on('room:list', async () => {
		const rooms = await Room.find().select('-users');
		socket.emit('room:list', rooms);
	});

	// Obtener usuarios en una sala
	socket.on('room:users', async ({ roomId }) => {
		const sockets = await io.in(roomId).fetchSockets();
		const users = sockets.map(s => s.user);
		socket.emit('room:users', users);
	});
}
