// src/validators/deliverynote.validator.js
import { z } from "zod";

export const createDeliveryNoteSchema = z.object({
  project: z.string().length(24),
  format: z.enum(["material", "hours"]),
  entries: z.array(z.object({
    worker: z.string().length(24).optional(),
    material: z.string().optional(),
    hours: z.number().min(0).optional(),
    quantity: z.number().min(0).optional(),
    description: z.string().optional()
  })).min(1),
  workDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
});

export const deliveryNoteIdParamSchema = z.object({
  id: z.string().length(24)
});

export const signDeliveryNoteSchema = z.object({
  id: z.string().length(24)
});
