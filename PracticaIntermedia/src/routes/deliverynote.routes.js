// src/routes/deliverynote.routes.js
import { Router } from 'express';
import * as deliveryNoteController from '../controllers/deliverynote.controller.js';
import { validate } from '../middleware/validate.js';
import { createDeliveryNoteSchema, deliveryNoteIdParamSchema } from '../validators/deliverynote.validator.js';
import { checkDeliveryNoteExists, checkDeliveryNoteNotSigned } from '../middleware/deliverynote.middleware.js';
import { auth } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', auth, validate(createDeliveryNoteSchema), deliveryNoteController.createDeliveryNote);
router.get('/', auth, deliveryNoteController.getDeliveryNotes);
router.get('/:id', auth, validate(deliveryNoteIdParamSchema, 'params'), checkDeliveryNoteExists, deliveryNoteController.getDeliveryNoteById);
router.get('/pdf/:id', auth, validate(deliveryNoteIdParamSchema, 'params'), checkDeliveryNoteExists, deliveryNoteController.downloadPDF);
router.patch('/:id/sign', auth, validate(deliveryNoteIdParamSchema, 'params'), checkDeliveryNoteExists, checkDeliveryNoteNotSigned, deliveryNoteController.signDeliveryNote);
router.delete('/:id', auth, validate(deliveryNoteIdParamSchema, 'params'), checkDeliveryNoteExists, checkDeliveryNoteNotSigned, deliveryNoteController.deleteDeliveryNote);

export default router;
