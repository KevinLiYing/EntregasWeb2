import prisma from '../config/prisma.js';
import { asyncHandler, errors } from '../utils/handleError.js';

// GET /api/books - Listar libros (con filtros)
export const getBooks = asyncHandler(async (req, res) => {
	const { author, genre, title, available, page = 1, limit = 10 } = req.query;
	const skip = (Number(page) - 1) * Number(limit);
	const where = {
		...(author && { author: { contains: author, mode: 'insensitive' } }),
		...(genre && { genre: { contains: genre, mode: 'insensitive' } }),
		...(title && { title: { contains: title, mode: 'insensitive' } }),
		...(available !== undefined && { available: { gt: 0 } })
	};
	const [books, total] = await Promise.all([
		prisma.book.findMany({
			where,
			orderBy: { title: 'asc' },
			skip,
			take: Number(limit)
		}),
		prisma.book.count({ where })
	]);
	res.json({
		data: books,
		pagination: {
			page: Number(page),
			limit: Number(limit),
			total,
			pages: Math.ceil(total / limit)
		}
	});
});

// GET /api/books/:id - Obtener libro por ID
export const getBookById = asyncHandler(async (req, res) => {
	const id = Number(req.params.id);
	const book = await prisma.book.findUnique({ where: { id } });
	if (!book) throw errors.notFound('Libro');
	res.json({ data: book });
});

// POST /api/books - Crear libro (Librarian/Admin)
export const createBook = asyncHandler(async (req, res) => {
	const { isbn, title, author, genre, description, publishedYear, copies } = req.body;
	if (!isbn || !title || !author || !genre || !publishedYear || !copies) {
		throw errors.badRequest('Faltan campos obligatorios');
	}
	const book = await prisma.book.create({
		data: {
			isbn,
			title,
			author,
			genre,
			description,
			publishedYear,
			copies,
			available: copies
		}
	});
	res.status(201).json({ data: book });
});

// PUT /api/books/:id - Actualizar libro (Librarian/Admin)
export const updateBook = asyncHandler(async (req, res) => {
	const id = Number(req.params.id);
	const { isbn, title, author, genre, description, publishedYear, copies } = req.body;
	const book = await prisma.book.findUnique({ where: { id } });
	if (!book) throw errors.notFound('Libro');

	// Si cambia el número de copias, ajustar available
	let available = book.available;
	if (copies !== undefined && copies !== book.copies) {
		const diff = copies - book.copies;
		available = book.available + diff;
		if (available < 0) available = 0;
	}

	const updated = await prisma.book.update({
		where: { id },
		data: {
			isbn,
			title,
			author,
			genre,
			description,
			publishedYear,
			copies,
			available
		}
	});
	res.json({ data: updated });
});

// DELETE /api/books/:id - Eliminar libro (Admin)
export const deleteBook = asyncHandler(async (req, res) => {
	const id = Number(req.params.id);
	const book = await prisma.book.findUnique({ where: { id } });
	if (!book) throw errors.notFound('Libro');
	await prisma.book.delete({ where: { id } });
	res.json({ message: 'Libro eliminado correctamente' });
});
