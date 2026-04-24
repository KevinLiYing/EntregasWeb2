import { z } from 'zod';

export const registerSchema = z.object({
	name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
	email: z.string().email('Email inválido'),
	password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres')
});

export const loginSchema = z.object({
	email: z.string().email('Email inválido'),
	password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres')
});

// Middleware para validar registro
export const validateRegister = (req, res, next) => {
	try {
		registerSchema.parse(req.body);
		next();
	} catch (err) {
		res.status(400).json({ error: true, message: err.errors?.[0]?.message || 'Datos inválidos' });
	}
};

// Middleware para validar login
export const validateLogin = (req, res, next) => {
	try {
		loginSchema.parse(req.body);
		next();
	} catch (err) {
		res.status(400).json({ error: true, message: err.errors?.[0]?.message || 'Datos inválidos' });
	}
};
