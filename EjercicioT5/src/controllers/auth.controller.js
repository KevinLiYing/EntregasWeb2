import prisma from '../config/prisma.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// POST /api/auth/register
export const register = async (req, res, next) => {
	try {
		const { email, name, password } = req.body;
		if (!email || !name || !password) {
			return res.status(400).json({ error: true, message: 'Faltan campos obligatorios' });
		}
		const exists = await prisma.user.findUnique({ where: { email } });
		if (exists) {
			return res.status(409).json({ error: true, message: 'El email ya está registrado' });
		}
		const hash = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({
			data: { email, name, password: hash }
		});
		const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
		res.status(201).json({
			user: { id: user.id, email: user.email, name: user.name, role: user.role },
			token
		});
	} catch (error) {
		next(error);
	}
};

// POST /api/auth/login
export const login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({ error: true, message: 'Faltan campos obligatorios' });
		}
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			return res.status(401).json({ error: true, message: 'Credenciales inválidas' });
		}
		const valid = await bcrypt.compare(password, user.password);
		if (!valid) {
			return res.status(401).json({ error: true, message: 'Credenciales inválidas' });
		}
		const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
		res.json({
			user: { id: user.id, email: user.email, name: user.name, role: user.role },
			token
		});
	} catch (error) {
		next(error);
	}
};

// GET /api/auth/me
export const getProfile = async (req, res, next) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id: req.user.id },
			select: { id: true, email: true, name: true, role: true }
		});
		res.json({ user });
	} catch (error) {
		next(error);
	}
};
