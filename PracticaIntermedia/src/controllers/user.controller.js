
import User from '../models/User.js';
import Company from '../models/Company.js';
import { AppError } from '../utils/AppError.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import notificationService from '../services/notification.service.js';

// Helpers
const signAccessToken = (user) => {
	return jwt.sign(
		{ id: user._id, email: user.email, role: user.role },
		process.env.JWT_SECRET,
		{ expiresIn: '15m' }
	);
};
const signRefreshToken = (user) => {
	return jwt.sign(
		{ id: user._id },
		process.env.JWT_REFRESH_SECRET,
		{ expiresIn: '7d' }
	);
};
const randomCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// 1) Registro de usuario
export const registerUser = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const exists = await User.findOne({ email });
		if (exists) return next(AppError.conflict('Email ya registrado'));
		const hash = await bcrypt.hash(password, 10);
		const code = randomCode();
		const user = await User.create({
			email,
			password: hash,
			role: 'admin',
			status: 'pending',
			verificationCode: code,
			verificationAttempts: 3
		});
		notificationService.emit('user:registered', user);
		const accessToken = signAccessToken(user);
		const refreshToken = signRefreshToken(user);
		// TODO: Save refreshToken in DB if you want to invalidate later
		res.status(201).json({
			user: { email: user.email, status: user.status, role: user.role },
			accessToken,
			refreshToken
		});
	} catch (err) {
		next(AppError.internal(err.message));
	}
};

// 2) Validación del email
export const validateEmail = async (req, res, next) => {
	try {
		const userId = req.user.id;
		const { code } = req.body;
		const user = await User.findById(userId);
		if (!user) return next(AppError.notFound('Usuario'));
		if (user.status === 'verified') return res.json({ message: 'Ya verificado' });
		if (user.verificationAttempts <= 0) return next(AppError.tooManyRequests('Demasiados intentos'));
		if (user.verificationCode !== code) {
			user.verificationAttempts -= 1;
			await user.save();
			return next(AppError.badRequest('Código incorrecto'));
		}
		user.status = 'verified';
		user.verificationCode = undefined;
		user.verificationAttempts = undefined;
		await user.save();
		notificationService.emit('user:verified', user);
		res.json({ message: 'Email verificado' });
	} catch (err) {
		next(AppError.internal(err.message));
	}
};

// 3) Login
export const loginUser = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email, deleted: false });
		if (!user) return next(AppError.unauthorized('Credenciales incorrectas'));
		const valid = await bcrypt.compare(password, user.password);
		if (!valid) return next(AppError.unauthorized('Credenciales incorrectas'));
		const accessToken = signAccessToken(user);
		const refreshToken = signRefreshToken(user);
		// TODO: Save refreshToken in DB if you want to invalidate later
		res.json({
			user: { email: user.email, status: user.status, role: user.role },
			accessToken,
			refreshToken
		});
	} catch (err) {
		next(AppError.internal(err.message));
	}
};

// 4) Onboarding datos personales
export const onboardingPersonal = async (req, res, next) => {
	try {
		const userId = req.user.id;
		const { name, lastName, nif } = req.body;
		const user = await User.findByIdAndUpdate(
			userId,
			{ name, lastName, nif },
			{ new: true, runValidators: true }
		);
		if (!user) return next(AppError.notFound('Usuario'));
		res.json({ message: 'Datos personales actualizados', user });
	} catch (err) {
		next(AppError.internal(err.message));
	}
};

// 4) Onboarding datos compañía
export const onboardingCompany = async (req, res, next) => {
	try {
		const userId = req.user.id;
		const { name, cif, address, isFreelance } = req.body;
		let company;
		if (isFreelance) {
			// Datos personales del usuario como compañía
			const user = await User.findById(userId);
			if (!user) return next(AppError.notFound('Usuario'));
			company = await Company.create({
				owner: userId,
				name: user.name,
				cif: user.nif,
				address: user.address,
				isFreelance: true
			});
			user.company = company._id;
			await user.save();
		} else {
			company = await Company.findOne({ cif });
			if (!company) {
				company = await Company.create({ owner: userId, name, cif, address, isFreelance: false });
				await User.findByIdAndUpdate(userId, { company: company._id, role: 'admin' });
			} else {
				await User.findByIdAndUpdate(userId, { company: company._id, role: 'guest' });
			}
		}
		res.json({ message: 'Onboarding de compañía completado', company });
	} catch (err) {
		next(AppError.internal(err.message));
	}
};

// 5) Logo de la compañía
export const uploadLogo = async (req, res, next) => {
	try {
		const userId = req.user.id;
		const user = await User.findById(userId);
		if (!user || !user.company) return next(AppError.badRequest('Usuario sin compañía'));
		const company = await Company.findById(user.company);
		if (!company) return next(AppError.notFound('Compañía'));
		if (!req.file) return next(AppError.badRequest('No se subió ningún archivo'));
		company.logo = `/uploads/${req.file.filename}`;
		await company.save();
		res.json({ message: 'Logo actualizado', logo: company.logo });
	} catch (err) {
		next(AppError.internal(err.message));
	}
};

// 6) Obtener usuario autenticado
export const getMe = async (req, res, next) => {
	try {
		const user = await User.findById(req.user.id).populate('company').select('-password');
		if (!user) return next(AppError.notFound('Usuario'));
		res.json(user);
	} catch (err) {
		next(AppError.internal(err.message));
	}
};

// 7) Refresh token
export const refreshToken = async (req, res, next) => {
	try {
		const { refreshToken } = req.body;
		if (!refreshToken) return next(AppError.badRequest('Refresh token requerido'));
		let payload;
		try {
			payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
		} catch (err) {
			return next(AppError.unauthorized('Refresh token inválido o expirado'));
		}
		const user = await User.findById(payload.id);
		if (!user) return next(AppError.unauthorized('Usuario no encontrado'));
		// TODO: Check if refreshToken is valid if you store them
		const newAccessToken = signAccessToken(user);
		res.json({ accessToken: newAccessToken });
	} catch (err) {
		next(AppError.internal(err.message));
	}
};

// 7) Logout
export const logout = async (req, res, next) => {
	try {
		// TODO: Invalidate refresh token if you store them
		res.json({ message: 'Sesión cerrada' });
	} catch (err) {
		next(AppError.internal(err.message));
	}
};

// 8) Eliminar usuario (hard/soft)
export const deleteMe = async (req, res, next) => {
	try {
		const userId = req.user.id;
		const soft = req.query.soft === 'true';
		let user;
		if (soft) {
			user = await User.findByIdAndUpdate(userId, { deleted: true }, { new: true });
		} else {
			user = await User.findByIdAndDelete(userId);
		}
		if (!user) return next(AppError.notFound('Usuario'));
		notificationService.emit('user:deleted', user);
		res.json({ message: soft ? 'Usuario eliminado (soft)' : 'Usuario eliminado (hard)' });
	} catch (err) {
		next(AppError.internal(err.message));
	}
};

// 9) Cambiar contraseña
export const changePassword = async (req, res, next) => {
	try {
		const userId = req.user.id;
		const { currentPassword, newPassword } = req.body;
		const user = await User.findById(userId);
		if (!user) return next(AppError.notFound('Usuario'));
		const valid = await bcrypt.compare(currentPassword, user.password);
		if (!valid) return next(AppError.unauthorized('Contraseña actual incorrecta'));
		if (currentPassword === newPassword) return next(AppError.badRequest('La nueva contraseña debe ser diferente a la actual'));
		user.password = await bcrypt.hash(newPassword, 10);
		await user.save();
		res.json({ message: 'Contraseña actualizada' });
	} catch (err) {
		next(AppError.internal(err.message));
	}
};

// 10) Invitar compañeros
export const inviteUser = async (req, res, next) => {
	try {
		const inviter = await User.findById(req.user.id);
		if (!inviter || inviter.role !== 'admin') return next(AppError.forbidden('Solo admin puede invitar'));
		const { email, name, lastName, nif } = req.body;
		const exists = await User.findOne({ email });
		if (exists) return next(AppError.conflict('Email ya registrado'));
		const code = randomCode();
		const user = await User.create({
			email,
			name,
			lastName,
			nif,
			password: code, // Temporal, debe cambiarse tras onboarding
			role: 'guest',
			status: 'pending',
			verificationCode: code,
			verificationAttempts: 3,
			company: inviter.company
		});
		notificationService.emit('user:invited', user);
		res.status(201).json({ message: 'Usuario invitado', user: { email: user.email, role: user.role } });
	} catch (err) {
		next(AppError.internal(err.message));
	}
};
