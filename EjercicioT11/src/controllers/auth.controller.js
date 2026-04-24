
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { handleHttpError } from '../utils/handleError.js';

// POST /api/auth/register
export const register = async (req, res) => {
	try {
		const { name, email, password } = req.body;
		if (!name || !email || !password) {
			return handleHttpError(res, 'Faltan campos requeridos', 400);
		}
		const existing = await User.findOne({ email });
		if (existing) {
			return handleHttpError(res, 'El email ya está registrado', 409);
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await User.create({ name, email, password: hashedPassword });
		res.status(201).json({ data: { id: user._id, name: user.name, email: user.email, role: user.role } });
	} catch (err) {
		handleHttpError(res, 'Error al registrar usuario');
	}
};

// POST /api/auth/login
export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return handleHttpError(res, 'Faltan campos requeridos', 400);
		}
		const user = await User.findOne({ email });
        // he puesto un mensaje genérico para no revelar si realmente existe el mail
		if (!user) {
			return handleHttpError(res, 'Credenciales inválidas', 401);
		}
		const valid = await bcrypt.compare(password, user.password);
		if (!valid) {
			return handleHttpError(res, 'Credenciales inválidas', 401);
		}
		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
		res.json({ data: { token } });
	} catch (err) {
		handleHttpError(res, 'Error al iniciar sesión');
	}
};

// GET /api/auth/me
export const me = async (req, res) => {
	try {
		const user = req.user;
		if (!user) {
			return handleHttpError(res, 'No autenticado', 401);
		}
		res.json({ data: { id: user._id, name: user.name, email: user.email, role: user.role } });
	} catch (err) {
		handleHttpError(res, 'Error al obtener perfil');
	}
};