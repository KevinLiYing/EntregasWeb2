
import app from './app.js';

// Solo inicia el servidor si no es test (útil para testing)
if (process.env.NODE_ENV !== 'test') {
	// El arranque real está en app.js, aquí solo se importa para compatibilidad
}
