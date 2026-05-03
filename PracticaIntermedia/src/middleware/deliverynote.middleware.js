// src/middleware/deliverynote.middleware.js
import DeliveryNote from '../models/DeliveryNote.js';
import AppError from '../utils/AppError.js';

export async function checkDeliveryNoteExists(req, res, next) {
  const { id } = req.params;
  const deliveryNote = await DeliveryNote.findOne({ _id: id, company: req.user.company });
  if (!deliveryNote) return next(new AppError('Albarán no encontrado', 404));
  req.deliveryNote = deliveryNote;
  next();
}

export async function checkDeliveryNoteNotSigned(req, res, next) {
  if (req.deliveryNote.signed) return next(new AppError('El albarán ya está firmado', 400));
  next();
}
