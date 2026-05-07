import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(2).max(100),
  code: z.string().min(2).max(30),
  address: z.object({
    street: z.string().min(1),
    number: z.string().min(1),
    postal: z.string().min(1),
    city: z.string().min(1),
    province: z.string().min(1)
  }),
  client: z.string().length(24)
});

export const updateProjectSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  code: z.string().min(2).max(30).optional(),
  address: z.object({
    street: z.string().min(1),
    number: z.string().min(1),
    postal: z.string().min(1),
    city: z.string().min(1),
    province: z.string().min(1)
  }).optional(),
  client: z.string().length(24).optional()
});

export const projectIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/)
});