// tests/deliverynote.test.js
import request from 'supertest';
import app from '../src/app.js';

describe('DeliveryNote Endpoints', () => {
  let token, clientId, projectId;
  beforeAll(async () => {
    await request(app)
      .post('/api/user/register')
      .send({
        email: 'note@email.com',
        password: 'Test1234',
        name: 'Note',
        lastName: 'User',
        nif: '33333333N'
      });
    const res = await request(app)
      .post('/api/user/login')
      .send({ email: 'note@email.com', password: 'Test1234' });
    token = res.body.accessToken;
    // Crear un cliente y un proyecto para asociar al albarán
    const clientRes = await request(app)
      .post('/api/client')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Cliente Note',
        cif: 'B00000003',
        email: 'clientenote@test.com',
        address: {
          street: 'Calle',
          number: '4',
          postal: '00003',
          city: 'Ciudad',
          province: 'Provincia'
        }
      });
    clientId = clientRes.body._id;
    const projectRes = await request(app)
      .post('/api/project')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Proyecto Note',
        code: 'PRJ-003',
        address: {
          street: 'Calle',
          number: '5',
          postal: '00004',
          city: 'Ciudad',
          province: 'Provincia'
        },
        client: clientId
      });
    projectId = projectRes.body._id;
  });

  it('debería crear un albarán', async () => {
    const res = await request(app)
      .post('/api/deliverynote')
      .set('Authorization', `Bearer ${token}`)
      .send({
        project: projectId,
        format: 'material',
        entries: [
          { material: 'Cemento', quantity: 10, description: 'Entrega de material' }
        ],
        workDate: '2026-05-03'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('format', 'material');
  });

  it('debería rechazar crear albarán sin token', async () => {
    const res = await request(app)
      .post('/api/deliverynote')
      .send({ project: projectId, format: 'material', entries: [], workDate: '2026-05-03' });
    expect(res.statusCode).toBe(401);
  });

  it('debería rechazar crear albarán con datos inválidos', async () => {
    const res = await request(app)
      .post('/api/deliverynote')
      .set('Authorization', `Bearer ${token}`)
      .send({ project: '', format: '', entries: [], workDate: '' });
    expect(res.statusCode).toBe(400);
  });
});
