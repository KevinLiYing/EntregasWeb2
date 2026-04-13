// Import core dependencies
import express from 'express';
import cors from 'cors';
// Import database connection
import dbConnect from './config/db.js';
// Import main API routes
import routes from './routes/index.js';
// Import error handling middleware
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';
// Create Express app
const app = express();

// =============================
// Global Middleware
// =============================

// Enable CORS for all origins
app.use(cors());
// Parse JSON bodies
app.use(express.json());
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// =============================
// Health Check Route
// =============================

// Simple endpoint to verify server is running
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
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

const startServer = async () => {
  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Servidor en http://localhost:${PORT}`);
      console.log(`📚 API en http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar:', error);
    process.exit(1);
  }
};

// Run the server
startServer();
