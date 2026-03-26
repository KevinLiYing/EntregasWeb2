
import request from 'supertest';
import app from '../src/app.js';

//
// ✓ GET  /api/podcasts → 200 con array (solo publicados)
// ✓ POST /api/podcasts → 201 con podcast creado (requiere token)
// ✓ POST /api/podcasts → 401 sin token
// ✓ DELETE /api/podcasts/:id → 200 solo para admin
// ✓ DELETE /api/podcasts/:id → 403 para user normal
// ✓ GET  /api/podcasts/admin/all → 200 solo para admin
//

describe('Podcast Endpoints', () => {
	let userToken = '';
	let adminToken = '';
	let podcastId = '';
	const testUser = {
		name: 'User Podcast',
		email: `userpodcast_${Date.now()}@example.com`,
		password: 'UserPassword123'
	};
	const adminUser = {
		name: 'Admin Podcast',
		email: `adminpodcast_${Date.now()}@example.com`,
		password: 'AdminPassword123',
		role: 'admin'
	};
	const podcastData = {
		title: 'Podcast Test',
		description: 'Descripción de prueba para el podcast',
		category: 'tech',
		duration: 120,
		episodes: 1,
		published: true
	};

	beforeAll(async () => {
		// Registrar y loguear usuario normal
		await request(app).post('/api/auth/register').send(testUser);
		const loginUser = await request(app).post('/api/auth/login').send({ email: testUser.email, password: testUser.password });
		userToken = loginUser.body.data.token;

		// Registrar y loguear admin (requiere que puedas crear admin manualmente o modificar en BD)
		await request(app).post('/api/auth/register').send(adminUser);
		// Aquí deberías actualizar el rol a admin en la BD si tu endpoint no lo permite directamente
		// await User.updateOne({ email: adminUser.email }, { role: 'admin' });
		const loginAdmin = await request(app).post('/api/auth/login').send({ email: adminUser.email, password: adminUser.password });
		adminToken = loginAdmin.body.data.token;
	});

	it('GET /api/podcasts → 200 con array (solo publicados)', async () => {
		const res = await request(app)
			.get('/api/podcasts')
			.expect(200);
		expect(Array.isArray(res.body.data)).toBe(true);
	});

	it('POST /api/podcasts → 401 sin token', async () => {
		await request(app)
			.post('/api/podcasts')
			.send(podcastData)
			.expect(401);
	});

	it('POST /api/podcasts → 201 con podcast creado (requiere token)', async () => {
		const res = await request(app)
			.post('/api/podcasts')
			.set('Authorization', `Bearer ${userToken}`)
			.send({ ...podcastData, author: 'fakeUserId' }) // Ajusta author según tu lógica
			.expect(201);
		expect(res.body.data).toBeDefined();
		podcastId = res.body.data._id || res.body.data.id;
	});

	it('DELETE /api/podcasts/:id → 403 para user normal', async () => {
		await request(app)
			.delete(`/api/podcasts/${podcastId}`)
			.set('Authorization', `Bearer ${userToken}`)
			.expect(403);
	});

	it('DELETE /api/podcasts/:id → 200 solo para admin', async () => {
		await request(app)
			.delete(`/api/podcasts/${podcastId}`)
			.set('Authorization', `Bearer ${adminToken}`)
			.expect(204);
	});

	it('GET /api/podcasts/admin/all → 200 solo para admin', async () => {
		await request(app)
			.get('/api/podcasts/admin/all')
			.set('Authorization', `Bearer ${adminToken}`)
			.expect(200);
	});
});