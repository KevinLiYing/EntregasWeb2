import request from 'supertest';
import app from '../src/app.js';

// POST   /api/auth/register   Público      Registro de usuario
// POST   /api/auth/login      Público      Login, devuelve token
// GET    /api/auth/me         Autenticado  Perfil del usuario actual

describe('Auth Endpoints', () => {
  let token = '';
  let userId = '';
  const testUser = {
    name: 'Test User',
    email: `test_${Date.now()}@example.com`,
    password: 'TestPassword123'
  };

  describe('POST /api/auth/register', () => {
    it('debería registrar un nuevo usuario', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect('Content-Type', /json/)
        .expect(201);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.email).toBe(testUser.email);
      expect(res.body.data.role).toBe('user');
      expect(res.body.data).not.toHaveProperty('password');
      userId = res.body.data.id;
    });

    it('debería rechazar email duplicado', async () => {
      await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(409);
    });

    it('debería rechazar datos inválidos', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ email: 'invalid' })
        .expect(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('debería hacer login correctamente', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: testUser.password })
        .expect(200);
      expect(res.body.data.token).toBeDefined();
      token = res.body.data.token;
    });

    it('debería rechazar password incorrecto', async () => {
      await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: 'WrongPassword123' })
        .expect(401);
    });

    it('debería rechazar usuario inexistente', async () => {
      await request(app)
        .post('/api/auth/login')
        .send({ email: 'noexiste@example.com', password: 'TestPassword123' })
        .expect(401);
    });
  });

  describe('GET /api/auth/me', () => {
    it('debería acceder con token válido', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      expect(res.body.data.email).toBe(testUser.email);
    });

    it('debería rechazar sin token', async () => {
      await request(app)
        .get('/api/auth/me')
        .expect(401);
    });

    it('debería rechazar token inválido', async () => {
      await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer token_invalido')
        .expect(401);
    });
  });

});