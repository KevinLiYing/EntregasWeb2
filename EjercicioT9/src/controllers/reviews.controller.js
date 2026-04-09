import prisma from '../config/prisma.js';

// GET /api/books/:id/reviews
export const getBookReviews = async (req, res, next) => {
	try {
		const bookId = Number(req.params.id);
		const reviews = await prisma.review.findMany({
			where: { bookId },
			include: {
				user: { select: { id: true, name: true } }
			},
			orderBy: { createdAt: 'desc' }
		});
		res.json({ data: reviews });
	} catch (error) {
		next(error);
	}
};

// POST /api/books/:id/reviews
export const createReview = async (req, res, next) => {
	try {
		const bookId = Number(req.params.id);
		const userId = req.user.id;
		const { rating, comment } = req.body;

		// Validar rating
		if (!rating || rating < 1 || rating > 5) {
			return res.status(400).json({
				error: true,
				message: 'El rating debe estar entre 1 y 5'
			});
		}

		// Verificar si ya tiene reseña para este libro
		const existing = await prisma.review.findUnique({
			where: { userId_bookId: { userId, bookId } }
		});
		if (existing) {
			return res.status(409).json({
				error: true,
				message: 'Solo puedes dejar una reseña por libro'
			});
		}

		// Verificar si el usuario ha devuelto el libro
		const loan = await prisma.loan.findFirst({
			where: {
				userId,
				bookId,
				status: 'RETURNED'
			}
		});
		if (!loan) {
			return res.status(403).json({
				error: true,
				message: 'Solo puedes reseñar libros que hayas devuelto'
			});
		}

		const review = await prisma.review.create({
			data: {
				userId,
				bookId,
				rating,
				comment
			}
		});
		res.status(201).json({ data: review });
	} catch (error) {
		next(error);
	}
};

// DELETE /api/reviews/:id
export const deleteReview = async (req, res, next) => {
	try {
		const reviewId = Number(req.params.id);
		const userId = req.user.id;

		const review = await prisma.review.findUnique({
			where: { id: reviewId }
		});
		if (!review) {
			return res.status(404).json({
				error: true,
				message: 'Reseña no encontrada'
			});
		}
		if (review.userId !== userId) {
			return res.status(403).json({
				error: true,
				message: 'Solo puedes eliminar tus propias reseñas'
			});
		}

		await prisma.review.delete({ where: { id: reviewId } });
		res.json({ message: 'Reseña eliminada correctamente' });
	} catch (error) {
		next(error);
	}
};
