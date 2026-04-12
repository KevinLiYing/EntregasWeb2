import multer from 'multer';
import path from 'path';
import { AppError } from '../utils/AppError.js';

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/');
	},
	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname);
		cb(null, `${Date.now()}-${file.fieldname}${ext}`);
	}
});

const fileFilter = (req, file, cb) => {
	if (!file.mimetype.startsWith('image/')) {
		return cb(AppError.badRequest('Solo se permiten imágenes'));
	}
	cb(null, true);
};

export const uploadLogo = multer({
	storage,
	fileFilter,
	limits: { fileSize: 5 * 1024 * 1024 } // 5MB
}).single('logo');
