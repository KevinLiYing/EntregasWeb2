

import express from 'express';
import cors from 'cors';
import dbConnect from './config/db.js';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerOptions from './docs/swagger.js';

import logger from './utils/logger.js';
import { requestLogger } from './middleware/logger.middleware.js';
import mongoose from 'mongoose';


const app = express();

// Middleware globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging de peticiones
app.use(requestLogger);

// Archivos estáticos
app.use('/uploads', express.static('storage'));


// Swagger docs
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check

app.get('/api/health', async (req, res) => {
	const healthcheck = {
		status: 'ok',
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
		environment: process.env.NODE_ENV
	};

	try {
		// Verificar conexión a BD
		await mongoose.connection.db.admin().ping();
		healthcheck.database = 'connected';
	} catch (error) {
		healthcheck.status = 'error';
		healthcheck.database = 'disconnected';
		return res.status(503).json(healthcheck);
	}

	res.json(healthcheck);
});

// Rutas de la API
app.use('/api', routes);

// Manejo de errores
app.use(notFound);
app.use(errorHandler);

// Iniciar servidor solo si no es test
if (process.env.NODE_ENV !== 'test') {
	const PORT = process.env.PORT || 3000;
	const startServer = async () => {
		await dbConnect();
		app.listen(PORT, () => {
			console.log(`🚀 Servidor en http://localhost:${PORT}`);
		});
	};
	startServer();
}

// Exportar app para testing
export default app;
