import { Router } from 'express';
import {
	registerUser,
	validateEmail,
	loginUser,
	onboardingPersonal,
	onboardingCompany,
	uploadLogo,
	getMe,
	refreshToken,
	logout,
	deleteMe,
	changePassword,
	inviteUser
} from '../controllers/user.controller.js';
import { validate } from '../middleware/validate.js';
import {
	registerUserSchema,
	validateEmailSchema,
	loginUserSchema,
	onboardingPersonalSchema,
	onboardingCompanySchema,
	changePasswordSchema,
	inviteUserSchema
} from '../validators/users.validator.js';
import { auth } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { uploadLogo as uploadLogoMulter } from '../middleware/upload.js';

const router = Router();

// Registro de usuario
router.post('/register', validate(registerUserSchema), registerUser);
// Validar email
router.put('/validation', auth, validate(validateEmailSchema), validateEmail);
// Login
router.post('/login', validate(loginUserSchema), loginUser);
// Onboarding datos personales
router.put('/register', auth, validate(onboardingPersonalSchema), onboardingPersonal);
// Onboarding datos compañía
router.patch('/company', auth, validate(onboardingCompanySchema), onboardingCompany);
// Subir logo de la compañía
router.patch('/logo', auth, uploadLogoMulter, uploadLogo);
// Obtener usuario autenticado
router.get('/', auth, getMe);
// Refresh token
router.post('/refresh', refreshToken);
// Logout
router.post('/logout', auth, logout);
// Eliminar usuario (soft/hard)
router.delete('/', auth, deleteMe);
// Cambiar contraseña
router.put('/password', auth, validate(changePasswordSchema), changePassword);
// Invitar compañeros (solo admin)
router.post('/invite', auth, requireRole('admin'), validate(inviteUserSchema), inviteUser);

export default router;
