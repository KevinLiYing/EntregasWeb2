import { Router } from 'express';
import {
	getUsers,
	getUserById,
	createUser,
	updateUser,
	deleteUser
} from '../controllers/user.controller.js';
// import { validate } from '../middleware/validate.js';
// import { userSchema, updateUserSchema } from '../validators/users.validator.js';
// import { auth } from '../middleware/auth.middleware.js';
// import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

// Get all users
router.get('/', /* auth, requireRole('admin'), */ getUsers);

// Get user by ID
router.get('/:id', /* auth, requireRole('admin'), */ getUserById);

// Create user
router.post('/', /* validate(userSchema), */ createUser);

// Update user
router.put('/:id', /* auth, requireRole('admin'), validate(updateUserSchema), */ updateUser);

// Delete user (soft delete)
router.delete('/:id', /* auth, requireRole('admin'), */ deleteUser);

export default router;
