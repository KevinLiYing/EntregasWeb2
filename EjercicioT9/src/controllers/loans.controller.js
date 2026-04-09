import prisma from '../config/prisma.js';

// GET /api/loans - Mis préstamos
export const getMyLoans = async (req, res, next) => {
	try {
		const userId = req.user.id;
		const loans = await prisma.loan.findMany({
			where: { userId },
			include: {
				book: true
			},
			orderBy: { loanDate: 'desc' }
		});
		res.json({ data: loans });
	} catch (error) {
		next(error);
	}
};

// GET /api/loans/all - Todos los préstamos (solo librarian/admin)
export const getAllLoans = async (req, res, next) => {
	try {
		const loans = await prisma.loan.findMany({
			include: {
				user: { select: { id: true, name: true, email: true } },
				book: true
			},
			orderBy: { loanDate: 'desc' }
		});
		res.json({ data: loans });
	} catch (error) {
		next(error);
	}
};

// POST /api/loans - Solicitar préstamo
export const createLoan = async (req, res, next) => {
	try {
		const userId = req.user.id;
		const { bookId } = req.body;

		// Validar existencia del libro
		const book = await prisma.book.findUnique({ where: { id: bookId } });
		if (!book) {
			return res.status(404).json({ error: true, message: 'Libro no encontrado' });
		}

		// No puede pedir prestado el mismo libro dos veces (activo)
		const existingLoan = await prisma.loan.findFirst({
			where: {
				userId,
				bookId,
				status: { in: ['ACTIVE', 'OVERDUE'] }
			}
		});
		if (existingLoan) {
			return res.status(409).json({ error: true, message: 'Ya tienes un préstamo activo de este libro' });
		}

		// Máximo 3 préstamos activos
		const activeLoans = await prisma.loan.count({
			where: {
				userId,
				status: { in: ['ACTIVE', 'OVERDUE'] }
			}
		});
		if (activeLoans >= 3) {
			return res.status(403).json({ error: true, message: 'Máximo 3 préstamos activos permitidos' });
		}

		// Solo si hay ejemplares disponibles
		if (book.available < 1) {
			return res.status(403).json({ error: true, message: 'No hay ejemplares disponibles' });
		}

		// Crear préstamo y actualizar inventario
		const dueDate = new Date();
		dueDate.setDate(dueDate.getDate() + 14); // 14 días

		const loan = await prisma.$transaction(async (tx) => {
			const newLoan = await tx.loan.create({
				data: {
					userId,
					bookId,
					dueDate
				}
			});
			await tx.book.update({
				where: { id: bookId },
				data: { available: { decrement: 1 } }
			});
			return newLoan;
		});

		res.status(201).json({ data: loan });
	} catch (error) {
		next(error);
	}
};

// PUT /api/loans/:id/return - Devolver libro
export const returnLoan = async (req, res, next) => {
	try {
		const loanId = Number(req.params.id);
		const userId = req.user.id;

		const loan = await prisma.loan.findUnique({ where: { id: loanId } });
		if (!loan) {
			return res.status(404).json({ error: true, message: 'Préstamo no encontrado' });
		}
		if (loan.userId !== userId) {
			return res.status(403).json({ error: true, message: 'No puedes devolver un préstamo que no es tuyo' });
		}
		if (loan.status !== 'ACTIVE' && loan.status !== 'OVERDUE') {
			return res.status(400).json({ error: true, message: 'El préstamo ya fue devuelto' });
		}

		const now = new Date();

		await prisma.$transaction([
			prisma.loan.update({
				where: { id: loanId },
				data: {
					status: 'RETURNED',
					returnDate: now
				}
			}),
			prisma.book.update({
				where: { id: loan.bookId },
				data: { available: { increment: 1 } }
			})
		]);

		res.json({ message: 'Libro devuelto correctamente' });
	} catch (error) {
		next(error);
	}
};
