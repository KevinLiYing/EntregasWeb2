// tests/project.test.js
import request from 'supertest';
import app from '../src/app.js';

describe('Project Endpoints', () => {
  let token, clientId;
  beforeAll(async () => {
    await request(app)
      .post('/api/user/register')
      .send({
        email: 'project@email.com',
        password: 'Test1234',
        name: 'Project',
        lastName: 'User',
        nif: '22222222P'
      });
    const res = await request(app)
      .post('/api/user/login')
      .send({ email: 'project@email.com', password: 'Test1234' });
    token = res.body.accessToken;
    // Crear un cliente para asociar al proyecto
    const clientRes = await request(app)
      .post('/api/client')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Cliente Proy',
        cif: 'B00000002',
        email: 'clienteproy@test.com',
        address: {
          street: 'Calle',
          number: '2',
          postal: '00001',
          city: 'Ciudad',
          province: 'Provincia'
        }
      });
    clientId = clientRes.body._id;
  });
    const request = require('supertest');
    const app = require('../src/app');
    const mongoose = require('mongoose');
    const Project = require('../src/models/Project');
    const Client = require('../src/models/Client');

    let projectIds = [];

    it('Crea 3 proyectos', async () => {
      for (let i = 1; i <= 3; i++) {
        const res = await request(app)
          .post('/api/project')
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: `Proyecto${i}`,
            code: `PRJ${i}`,
            address: {
              street: 'Calle', number: '1', postal: '00000', city: 'Ciudad', province: 'Provincia'
            },
            client: clientId
          });
        expect(res.statusCode).toBe(201);
        projectIds.push(res.body._id);
      }
    });

    it('Archiva 1 proyecto', async () => {
      const res = await request(app)
        .delete(`/api/project/${projectIds[0]}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
    });

    it('GET /api/project devuelve 2', async () => {
      const res = await request(app)
        .get('/api/project')
        .set('Authorization', `Bearer ${token}`);
      expect(res.body.projects.length).toBe(2);
    });

    it('GET /api/project/archived devuelve 1', async () => {
      const res = await request(app)
        .get('/api/project/archived')
        .set('Authorization', `Bearer ${token}`);
      expect(res.body.length).toBe(1);
    });

    it('Restaura el archivado', async () => {
      const res = await request(app)
        .patch(`/api/project/${projectIds[0]}/restore`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
    });

    it('GET /api/project devuelve 3 de nuevo', async () => {
      const res = await request(app)
        .get('/api/project')
        .set('Authorization', `Bearer ${token}`);
      expect(res.body.projects.length).toBe(3);
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('debería crear un proyecto', async () => {
    const res = await request(app)
      .post('/api/project')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Proyecto Test',
        code: 'PRJ-001',
        address: {
          street: 'Calle',
          number: '3',
          postal: '00002',
          city: 'Ciudad',
          province: 'Provincia'
        },
        client: clientId
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('name', 'Proyecto Test');
  });

  it('debería rechazar crear proyecto sin token', async () => {
    const res = await request(app)
      .post('/api/project')
      .send({ name: 'Sin Token', code: 'PRJ-002', address: {}, client: clientId });
    expect(res.statusCode).toBe(401);
  });

  it('debería rechazar crear proyecto con datos inválidos', async () => {
    const res = await request(app)
      .post('/api/project')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '', code: '', address: {}, client: '' });
    expect(res.statusCode).toBe(400);
  });
});
