/*
GET	/api/podcasts	Público	Listar podcasts publicados
GET	/api/podcasts/:id	Público	Obtener un podcast
POST	/api/podcasts	Autenticado	Crear podcast
PUT	/api/podcasts/:id	Autenticado (autor)	Actualizar propio podcast
DELETE	/api/podcasts/:id	Admin	Eliminar cualquier podcast
GET	/api/podcasts/admin/all	Admin	Listar todos (incluye no publicados)
PATCH	/api/podcasts/:id/publish	Admin	Publicar/despublicar
*/