// src/routes/index.js
import { Router } from 'express';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const router = Router();

// Node.js 20.11+
const __dirname = import.meta.dirname;

// Cargar automáticamente archivos *.routes.js
const routeFiles = readdirSync(__dirname).filter(
  (file) => file.endsWith('.routes.js')
);

for (const file of routeFiles) {
  const routeName = file.replace('.routes.js', '');
  const fileUrl = pathToFileURL(join(__dirname, file));

  const routeModule = await import(fileUrl.href);

  router.use(`/${routeName}`, routeModule.default);
  console.log(`📍 Ruta cargada: /api/${routeName}`);
}

export default router;