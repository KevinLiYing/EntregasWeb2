import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(6)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const bookSchema = z.object({
  isbn: z.string().min(5),
  title: z.string().min(1),
  author: z.string().min(1),
  genre: z.string().min(1),
  description: z.string().optional(),
  publishedYear: z.number().int().gte(0),
  copies: z.number().int().gte(1)
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional()
});

export const loanSchema = z.object({
  bookId: z.number().int().gte(1)
});
