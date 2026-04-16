import User from '../models/user.model.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';

// Registro
export async function register(req, res) {
  const { name, email, password } = req.body;
  console.log('Registro - password recibido:', password);
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email ya registrado' });
    const user = await User.create({ name, email, password });
    const token = signToken({ id: user._id, name: user.name, email: user.email });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Login
export async function login(req, res) {
  const { email, password } = req.body;
  console.log('Login - password recibido:', password);
  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña requeridos' });
  }
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(400).json({ message: 'Credenciales inválidas' });
    const valid = await user.comparePassword(password);
    if (!valid) return res.status(400).json({ message: 'Credenciales inválidas' });
    const token = signToken({ id: user._id, name: user.name, email: user.email });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Perfil
export async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
