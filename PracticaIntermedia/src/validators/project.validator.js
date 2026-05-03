// src/validators/project.validator.js
import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(2).max(100),
  code: z.string().min(2).max(30),
  address: z.string().min(2).max(200),
  client: z.string().length(24)
});

export const updateProjectSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  code: z.string().min(2).max(30).optional(),
  address: z.string().min(2).max(200).optional(),
  client: z.string().length(24).optional()
});

export const projectIdParamSchema = z.object({
  id: z.string().length(24)
});

export const restoreProjectSchema = projectIdParamSchema;
