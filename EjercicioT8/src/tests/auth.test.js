/*
✓ POST /api/auth/register → 201 con usuario creado
✓ POST /api/auth/register → 400 si email duplicado
✓ POST /api/auth/register → 400 si faltan campos
✓ POST /api/auth/login → 201 con token cuando credenciales válidas
✓ POST /api/auth/login → 401 si contraseña incorrecta
✓ GET  /api/auth/me → 200 con datos del usuario (requiere token)
✓ GET  /api/auth/me → 401 sin token
*/