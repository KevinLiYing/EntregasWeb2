import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import dotenv from 'dotenv';
import dbConnect from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import roomsRoutes from './routes/rooms.routes.js';
import { chatHandler } from './sockets/handlers/chat.handlers.js';
import { roomHandler } from './sockets/handlers/room.handlers.js';
import { socketAuthMiddleware } from './middleware/socketAuth.middleware.js';

dotenv.config();
dbConnect();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST']
	}
});

// Middleware
app.use(express.json());
app.use(express.static(path.resolve('public')));

// Rutas REST
app.use('/api', authRoutes);
app.use('/api', roomsRoutes);

// Estado del servidor
app.get('/api/status', (req, res) => {
	res.json({ status: 'ok', connections: io.engine.clientsCount });
});

// Socket.IO
io.use(socketAuthMiddleware); // Autenticación JWT en sockets
io.on('connection', (socket) => {
	chatHandler(io, socket);
	roomHandler(io, socket);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
	console.log(`Servidor en http://localhost:${PORT}`);
});

export default app;
