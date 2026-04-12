import User from '../models/User.js';
import { AppError } from '../utils/AppError.js';

// Get all users
export const getUsers = async (req, res, next) => {
	try {
		const users = await User.find({ deleted: false }).select('-password');
		res.json(users);
	} catch (err) {
		next(AppError.internal(err.message));
	}
};

// Get user by ID
export const getUserById = async (req, res, next) => {
	try {
		const user = await User.findOne({ _id: req.params.id, deleted: false }).select('-password');
		if (!user) return next(AppError.notFound('Usuario'));
		res.json(user);
	} catch (err) {
		next(AppError.internal(err.message));
	}
};

// Create user
export const createUser = async (req, res, next) => {
	try {
		const user = new User(req.body);
		await user.save();
		res.status(201).json({ message: 'Usuario creado', user: user.toObject({ versionKey: false, transform: (doc, ret) => { delete ret.password; return ret; } }) });
	} catch (err) {
		if (err.code === 11000) return next(AppError.conflict('Email ya registrado'));
		next(AppError.internal(err.message));
	}
};

// Update user
export const updateUser = async (req, res, next) => {
	try {
		const user = await User.findOneAndUpdate(
			{ _id: req.params.id, deleted: false },
			req.body,
			{ new: true, runValidators: true }
		).select('-password');
		if (!user) return next(AppError.notFound('Usuario'));
		res.json({ message: 'Usuario actualizado', user });
	} catch (err) {
		next(AppError.internal(err.message));
	}
};

// Soft delete user
export const deleteUser = async (req, res, next) => {
	try {
		const user = await User.findOneAndUpdate(
			{ _id: req.params.id, deleted: false },
			{ deleted: true },
			{ new: true }
		);
		if (!user) return next(AppError.notFound('Usuario'));
		res.json({ message: 'Usuario eliminado' });
	} catch (err) {
		next(AppError.internal(err.message));
	}
};
