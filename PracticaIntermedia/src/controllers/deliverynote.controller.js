// src/controllers/deliverynote.controller.js
import * as deliveryNoteService from '../services/deliverynote.service.js';

export async function createDeliveryNote(req, res, next) {
  try {
    const deliveryNote = await deliveryNoteService.createDeliveryNote(req.body, req.user);
    res.status(201).json(deliveryNote);
  } catch (err) {
    next(err);
  }
}

export async function getDeliveryNotes(req, res, next) {
  try {
    const result = await deliveryNoteService.getDeliveryNotes(req.query, req.user);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getDeliveryNoteById(req, res, next) {
  try {
    res.json(req.deliveryNote);
  } catch (err) {
    next(err);
  }
}

export async function downloadPDF(req, res, next) {
  try {
    // Implementación pendiente: generación y descarga de PDF
    res.status(501).json({ message: 'No implementado' });
  } catch (err) {
    next(err);
  }
}

export async function signDeliveryNote(req, res, next) {
  try {
    // Implementación pendiente: firma y subida de PDF/firma
    res.status(501).json({ message: 'No implementado' });
  } catch (err) {
    next(err);
  }
}

export async function deleteDeliveryNote(req, res, next) {
  try {
    await deliveryNoteService.deleteDeliveryNote(req.params.id, req.user);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
