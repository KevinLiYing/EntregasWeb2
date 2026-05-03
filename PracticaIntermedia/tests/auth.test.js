// tests/auth.test.js
import request from 'supertest';
import app from '../src/app.js';

describe('Auth Endpoints', () => {
  it('debería registrar un usuario', async () => {
    const res = await request(app)
      .post('/api/user/register')
      .send({
        email: 'test@email.com',
        password: 'Test1234',
        name: 'Test',
        lastName: 'User',
        nif: '12345678A'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('email', 'test@email.com');
  });

  it('debería rechazar registro con email inválido', async () => {
    const res = await request(app)
      .post('/api/user/register')
      .send({
        email: 'notanemail',
        password: 'Test1234',
        name: 'Test',
        lastName: 'User',
        nif: '12345678A'
      });
    expect(res.statusCode).toBe(400);
  });

  it('debería hacer login con usuario registrado', async () => {
    await request(app)
      .post('/api/user/register')
      .send({
        email: 'login@email.com',
        password: 'Test1234',
        name: 'Login',
        lastName: 'User',
        nif: '87654321B'
      });
    const res = await request(app)
      .post('/api/user/login')
      .send({
        email: 'login@email.com',
        password: 'Test1234'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
  });
});
