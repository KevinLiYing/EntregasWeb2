// src/controllers/auth.controller.js
import User from '../models/user.model.js';
import { encrypt, compare } from '../utils/handlePassword.js';
import { tokenSign } from '../utils/handleJwt.js';
import { handleHttpError } from '../utils/handleError.js';

/**
 * Registrar nuevo usuario
 * POST /api/auth/register
 */
export const registerCtrl = async (req, res) => {
  try {
    // Verificar si el email ya existe
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      handleHttpError(res, 'EMAIL_ALREADY_EXISTS', 409);
      return;
    }
    
    // Cifrar contraseña
    const password = await encrypt(req.body.password);
    
    // Crear usuario con password cifrada
    const body = { ...req.body, password };
    const dataUser = await User.create(body);
    
    // Ocultar password en la respuesta
    dataUser.set('password', undefined, { strict: false });
    
    // Generar token
    const data = {
      token: tokenSign(dataUser),
      user: dataUser
    };
    
    res.status(201).send(data);
  } catch (err) {
    console.log(err);
    handleHttpError(res, 'ERROR_REGISTER_USER');
  }
};

/**
 * Login de usuario
 * POST /api/auth/login
 */
export const loginCtrl = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Buscar usuario incluyendo el password
    const user = await User.findOne({ email }).select('password name role email');
    
    if (!user) {
      handleHttpError(res, 'USER_NOT_EXISTS', 404);
      return;
    }
    
    // Comparar contraseñas
    const hashPassword = user.password;
    const check = await compare(password, hashPassword);
    
    if (!check) {
      handleHttpError(res, 'INVALID_PASSWORD', 401);
      return;
    }
    
    // Ocultar password en la respuesta
    user.set('password', undefined, { strict: false });
    
    // Generar token y responder
    const data = {
      token: tokenSign(user),
      user
    };
    
    res.send(data);
  } catch (err) {
    console.log(err);
    handleHttpError(res, 'ERROR_LOGIN_USER');
  }
};