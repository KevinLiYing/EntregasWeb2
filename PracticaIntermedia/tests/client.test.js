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

  let clientIds = [];

  it('Crea 3 clientes', async () => {
    for (let i = 1; i <= 3; i++) {
      const res = await request(app)
        .post('/api/client')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: `Cliente${i}`,
          cif: `CIF${i}`,
          email: `cliente${i}@mail.com`,
          address: {
            street: 'Calle', number: '1', postal: '00000', city: 'Ciudad', province: 'Provincia'
          }
        });
      expect(res.statusCode).toBe(201);
      clientIds.push(res.body._id);
    }
  });

  it('Archiva 1 cliente', async () => {
    const res = await request(app)
      .delete(`/api/client/${clientIds[0]}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });

  it('GET /api/client devuelve 2', async () => {
    const res = await request(app)
      .get('/api/client')
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.clients.length).toBe(2);
  });

  it('GET /api/client/archived devuelve 1', async () => {
    const res = await request(app)
      .get('/api/client/archived')
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.length).toBe(1);
  });

  it('Restaura el archivado', async () => {
    const res = await request(app)
      .patch(`/api/client/${clientIds[0]}/restore`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });

  it('GET /api/client devuelve 3 de nuevo', async () => {
    const res = await request(app)
      .get('/api/client')
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.clients.length).toBe(3);
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
