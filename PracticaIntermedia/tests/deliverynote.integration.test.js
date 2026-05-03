// tests/deliverynote.integration.test.js
import request from 'supertest';
import app from '../src/app.js';

describe('DeliveryNote Integration', () => {
  let token, clientId, projectId, deliveryNoteId;
  beforeAll(async () => {
    await request(app)
      .post('/api/user/register')
      .send({
        email: 'integration@email.com',
        password: 'Test1234',
        name: 'Integration',
        lastName: 'User',
        nif: '44444444I'
      });
    const res = await request(app)
      .post('/api/user/login')
      .send({ email: 'integration@email.com', password: 'Test1234' });
    token = res.body.accessToken;
    // Crear cliente y proyecto
    const clientRes = await request(app)
      .post('/api/client')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Cliente Int',
        cif: 'B00000004',
        email: 'clienteint@test.com',
        address: {
          street: 'Calle',
          number: '6',
          postal: '00005',
          city: 'Ciudad',
          province: 'Provincia'
        }
      });
    clientId = clientRes.body._id;
    const projectRes = await request(app)
      .post('/api/project')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Proyecto Int',
        code: 'PRJ-004',
        address: {
          street: 'Calle',
          number: '7',
          postal: '00006',
          city: 'Ciudad',
          province: 'Provincia'
        },
        client: clientId
      });
    projectId = projectRes.body._id;
  });

  it('debería crear y obtener un albarán', async () => {
    const createRes = await request(app)
      .post('/api/deliverynote')
      .set('Authorization', `Bearer ${token}`)
      .send({
        project: projectId,
        format: 'material',
        entries: [
          { material: 'Arena', quantity: 5, description: 'Entrega de arena' }
        ],
        workDate: '2026-05-03'
      });
    expect(createRes.statusCode).toBe(201);
    deliveryNoteId = createRes.body._id;

    const getRes = await request(app)
      .get(`/api/deliverynote/${deliveryNoteId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body).toHaveProperty('format', 'material');
  });

  it('debería listar albaranes paginados', async () => {
    const res = await request(app)
      .get('/api/deliverynote?page=1&limit=2')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('deliveryNotes');
    expect(Array.isArray(res.body.deliveryNotes)).toBe(true);
  });

  it('debería rechazar borrar un albarán firmado', async () => {
    // Firmar el albarán
    await request(app)
      .patch(`/api/deliverynote/${deliveryNoteId}/sign`)
      .set('Authorization', `Bearer ${token}`)
      .send({ signatureUrl: 'https://firma.com/firma.png' });
    // Intentar borrar
    const res = await request(app)
      .delete(`/api/deliverynote/${deliveryNoteId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(400);
  });
});
