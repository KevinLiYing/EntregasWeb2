// src/validators/client.validator.js
import { z } from "zod";

export const createClientSchema = z.object({
  name: z.string().min(2).max(100),
  cif: z.string().min(8).max(15),
  email: z.string().email(),
  address: z.object({
    street: z.string().min(2).max(100),
    number: z.string().min(1).max(10),
    postal: z.string().min(2).max(10),
    city: z.string().min(2).max(100),
    province: z.string().min(2).max(100)
  })
});

export const updateClientSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  cif: z.string().min(8).max(15).optional(),
  email: z.string().email().optional(),
  address: z.string().min(2).max(200).optional()
});

export const clientIdParamSchema = z.object({
  id: z.string().length(24)
});

export const restoreClientSchema = clientIdParamSchema;
