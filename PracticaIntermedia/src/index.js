import app from './app.js';
import dbConnect from './config/index.js';

const PORT = process.env.PORT || 3000;

const start = async () => {
	await dbConnect();
	app.listen(PORT, () => {
		console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
	});
};

start();
