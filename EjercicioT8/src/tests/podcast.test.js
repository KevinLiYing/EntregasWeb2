/*
✓ GET  /api/podcasts → 200 con array (solo publicados)
✓ POST /api/podcasts → 201 con podcast creado (requiere token)
✓ POST /api/podcasts → 401 sin token
✓ DELETE /api/podcasts/:id → 200 solo para admin
✓ DELETE /api/podcasts/:id → 403 para user normal
✓ GET  /api/podcasts/admin/all → 200 solo para admin
*/