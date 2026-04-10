import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hashea una contraseña en texto plano
 * @param {string} plainPassword
 * @returns {Promise<string>} hash
 */
export async function hashPassword(plainPassword) {
	return await bcrypt.hash(plainPassword, SALT_ROUNDS);
}

/**
 * Compara una contraseña en texto plano con su hash
 * @param {string} plainPassword
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
export async function verifyPassword(plainPassword, hash) {
	return await bcrypt.compare(plainPassword, hash);
}
