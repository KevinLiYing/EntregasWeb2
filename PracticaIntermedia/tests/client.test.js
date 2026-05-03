// tests/client.test.js
import request from 'supertest';
import app from '../src/app.js';

describe('Client Endpoints', () => {
  let token;
  beforeAll(async () => {
    await request(app)
      .post('/api/user/register')
      .send({
        email: 'client@email.com',
        password: 'Test1234',
        name: 'Client',
        lastName: 'User',
        nif: '11111111C'
      });
    const res = await request(app)
      .post('/api/user/login')
      .send({ email: 'client@email.com', password: 'Test1234' });
    token = res.body.accessToken;
  });

  it('debería crear un cliente', async () => {
    const res = await request(app)
      .post('/api/client')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Cliente Test',
        cif: 'B00000001',
        email: 'cliente@test.com',
        address: {
          street: 'Calle',
          number: '1',
          postal: '00000',
          city: 'Ciudad',
          province: 'Provincia'
        }
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('name', 'Cliente Test');
  });

  it('debería rechazar crear cliente sin token', async () => {
    const res = await request(app)
      .post('/api/client')
      .send({ name: 'Test', cif: 'B00000000', email: 'test@client.com', address: { street: 'Calle', number: '1', postal: '00000', city: 'Ciudad', province: 'Provincia' } });
    expect(res.statusCode).toBe(401);
  });

  it('debería rechazar crear cliente con datos inválidos', async () => {
    const res = await request(app)
      .post('/api/client')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '', cif: '', email: 'noemail', address: {} });
    expect(res.statusCode).toBe(400);
  });
});
