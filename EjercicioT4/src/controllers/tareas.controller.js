// controlador de tareas
import { tareas } from '../data/tareas.js';
import { ApiError } from '../middleware/errorHandler.js';

const tarea = tareas;

// GET /api/tareas
export const getAll = (req, res) => {
  let resultado = [...tarea];
  const { nivel, lenguaje, orden, limit, offset } = req.query;
  
  // Filtrar por nivel
  if (nivel) {
    resultado = resultado.filter(c => c.nivel === nivel);
  }
  
  // Ordenar
  if (orden === 'vistas') {
    resultado.sort((a, b) => b.vistas - a.vistas);
  } else if (orden === 'titulo') {
    resultado.sort((a, b) => a.titulo.localeCompare(b.titulo));
  }
  
  res.json(resultado);
};

// GET /api/tareass/tarea/:id
export const getById = (req, res) => {
  const id = parseInt(req.params.id);
  const tareas = tarea.find(c => c.id === id);
  
  if (!tareas) {
    throw ApiError.notFound(`tareas con ID ${id} no encontrado`);
  }
  
  res.json(tareas);
};

// POST /api/tareass/tarea
export const create = (req, res) => {
  const { titulo, prioridad, dueDate, tags } = req.body;
  
  const nuevatarea = {
    id: tarea.length + 1,
    titulo,
    prioridad,
    dueDate,
    tags
  };
  
  tarea.push(nuevatarea);
  
  res.status(201).json(nuevatarea);
};

// PUT /api/tareas/tarea/:id
export const update = (req, res) => {
  const id = parseInt(req.params.id);
  const index = tarea.findIndex(c => c.id === id);
  
  if (index === -1) {
    throw ApiError.notFound(`tareas con ID ${id} no encontrado`);
  }
  
  const { titulo, prioridad, dueDate, tags } = req.body;
  
  tarea[index] = {
    id,
    titulo,
    prioridad,
    dueDate,
    tags
  };
  
  res.json(tarea[index]);
};

// PATCH /api/tareas/tarea/:id
export const partialUpdate = (req, res) => {
  const id = parseInt(req.params.id);
  const index = tarea.findIndex(c => c.id === id);
  
  if (index === -1) {
    throw ApiError.notFound(`tareas con ID ${id} no encontrado`);
  }
  
  tarea[index] = {
    ...tarea[index],
    ...req.body
  };
  
  res.json(tarea[index]);
};

// DELETE /api/tareas/tarea/:id
export const remove = (req, res) => {
  const id = parseInt(req.params.id);
  const index = tarea.findIndex(c => c.id === id);
  
  if (index === -1) {
    throw ApiError.notFound(`tareas con ID ${id} no encontrado`);
  }
  
  tarea.splice(index, 1);
  
  res.status(204).end();
};