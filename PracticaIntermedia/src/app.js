// Import core dependencies
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
// Import database connection
import dbConnect from './config/db.js';
// Import main API routes
import routes from './routes/index.js';
// Import error handling middleware
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';
// Create Express app
import http from 'http';
import { setupSocket } from './sockets/index.js';
import { setSocketInstance } from './services/socket.service.js';

const app = express();
const server = http.createServer(app);
const io = setupSocket(server);
setSocketInstance(io);

// =============================
// Global Middleware
// =============================

// Enable CORS for all origins
app.use(cors());
// Seguridad HTTP headers
app.use(helmet());
// Sanitización contra NoSQL injection
app.use(mongoSanitize());
// Parse JSON bodies
app.use(express.json());
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// =============================
// Health Check Route
// =============================

// Endpoint de health mejorado
import mongoose from 'mongoose';
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// =============================
// Main API Routes
// =============================

// Mount all API routes under /api
app.use('/api', routes);

// =============================
// Error Handling
// =============================

// Handle 404 Not Found
app.use(notFoundHandler);
// Centralized error handler
app.use(errorHandler);

// =============================
// Start Server
// =============================

const PORT = process.env.PORT || 3000;

console.log('DB_URI from .env:', process.env.DB_URI);

let shuttingDown = false;
const startServer = async () => {
  try {
    // Connect to MongoDB
    await dbConnect();

    // Start Express+Socket.IO server
    const httpServer = server.listen(PORT, () => {
      console.log(`🚀 Servidor en http://localhost:${PORT}`);
      console.log(`📚 API en http://localhost:${PORT}/api`);
      console.log(`🔌 WebSocket en http://localhost:${PORT}`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      if (shuttingDown) return;
      shuttingDown = true;
      console.log('⏳ Cerrando servidor...');
      httpServer.close(() => {
        console.log('🛑 Servidor HTTP cerrado');
      });
      try {
        await mongoose.connection.close();
        console.log('🛑 Conexión MongoDB cerrada');
      } catch (e) {
        console.error('Error cerrando MongoDB:', e);
      }
      if (io) {
        io.close(() => {
          console.log('🛑 Socket.IO cerrado');
          process.exit(0);
        });
      } else {
        process.exit(0);
      }
    };
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('❌ Error al iniciar:', error);
    process.exit(1);
  }
};

// Run the server
startServer();
