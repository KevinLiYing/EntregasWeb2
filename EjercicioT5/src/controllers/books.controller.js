import prisma from '../config/prisma.js';

// GET /api/books - Listar libros (con filtros)
export const getBooks = async (req, res, next) => {
	try {
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
	} catch (error) {
		next(error);
	}
};

// GET /api/books/:id - Obtener libro por ID
export const getBookById = async (req, res, next) => {
	try {
		const id = Number(req.params.id);
		const book = await prisma.book.findUnique({ where: { id } });
		if (!book) {
			return res.status(404).json({ error: true, message: 'Libro no encontrado' });
		}
		res.json({ data: book });
	} catch (error) {
		next(error);
	}
};

// POST /api/books - Crear libro (Librarian/Admin)
export const createBook = async (req, res, next) => {
	try {
		const { isbn, title, author, genre, description, publishedYear, copies } = req.body;
		if (!isbn || !title || !author || !genre || !publishedYear || !copies) {
			return res.status(400).json({ error: true, message: 'Faltan campos obligatorios' });
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
	} catch (error) {
		next(error);
	}
};

// PUT /api/books/:id - Actualizar libro (Librarian/Admin)
export const updateBook = async (req, res, next) => {
	try {
		const id = Number(req.params.id);
		const { isbn, title, author, genre, description, publishedYear, copies } = req.body;
		const book = await prisma.book.findUnique({ where: { id } });
		if (!book) {
			return res.status(404).json({ error: true, message: 'Libro no encontrado' });
		}

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
	} catch (error) {
		next(error);
	}
};

// DELETE /api/books/:id - Eliminar libro (Admin)
export const deleteBook = async (req, res, next) => {
	try {
		const id = Number(req.params.id);
		const book = await prisma.book.findUnique({ where: { id } });
		if (!book) {
			return res.status(404).json({ error: true, message: 'Libro no encontrado' });
		}
		await prisma.book.delete({ where: { id } });
		res.json({ message: 'Libro eliminado correctamente' });
	} catch (error) {
		next(error);
	}
};
