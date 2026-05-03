// src/services/deliverynote.service.js
import DeliveryNote from '../models/DeliveryNote.js';
import Project from '../models/Project.js';
import AppError from '../utils/AppError.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { notifyDeliveryNoteNew, notifyDeliveryNoteSigned } from './socket.service.js';

// Puedes reemplazar esto por integración real con Cloudinary, S3, etc.
async function uploadToCloud(localPath) {
  // Simulación: retorna la ruta local como URL
  return `https://fake-cloud/${path.basename(localPath)}`;
}

export async function createDeliveryNote(data, user) {
  const project = await Project.findOne({ _id: data.project, company: user.company });
  if (!project) throw new AppError('Proyecto no encontrado', 404);
  const deliveryNote = await DeliveryNote.create({ ...data, user: user._id, company: user.company });
  notifyDeliveryNoteNew(user.company, deliveryNote);
  return deliveryNote;
}

export async function getDeliveryNotes(query, user) {
  const { page = 1, limit = 10, project, client, format, signed, from, to, sort = 'workDate' } = query;
  const filter = { company: user.company };
  if (project) filter.project = project;
  if (client) filter.client = client;
  if (format) filter.format = format;
  if (signed !== undefined) filter.signed = signed === 'true';
  if (from && to) filter.workDate = { $gte: from, $lte: to };
  const totalItems = await DeliveryNote.countDocuments(filter);
  const deliveryNotes = await DeliveryNote.find(filter)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(Number(limit));
  return {
    deliveryNotes,
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
    currentPage: Number(page)
  };
}

export async function getDeliveryNoteById(id, user) {
  const deliveryNote = await DeliveryNote.findOne({ _id: id, company: user.company })
    .populate('user client project');
  if (!deliveryNote) throw new AppError('Albarán no encontrado', 404);
  return deliveryNote;
}

export async function deleteDeliveryNote(id, user) {
  const deliveryNote = await DeliveryNote.findOne({ _id: id, company: user.company });
  if (!deliveryNote) throw new AppError('Albarán no encontrado', 404);
  if (deliveryNote.signed) throw new AppError('No se puede borrar un albarán firmado', 400);
  await deliveryNote.deleteOne();
  return null;
}

export async function signDeliveryNote(id, user, signatureUrl) {
  const deliveryNote = await DeliveryNote.findOne({ _id: id, company: user.company });
  if (!deliveryNote) throw new AppError('Albarán no encontrado', 404);
  if (deliveryNote.signed) throw new AppError('El albarán ya está firmado', 400);
  deliveryNote.signed = true;
  deliveryNote.signatureUrl = signatureUrl;
  // Generar PDF y subirlo
  const pdfPath = await generateAndUploadPDF(deliveryNote);
  deliveryNote.pdfUrl = pdfPath;
  await deliveryNote.save();
  notifyDeliveryNoteSigned(user.company, deliveryNote);
  return deliveryNote;
}

async function generateAndUploadPDF(deliveryNote) {
  // Genera un PDF temporal
  const fileName = `deliverynote-${deliveryNote._id}.pdf`;
  const filePath = path.join('/tmp', fileName);
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath));
  doc.fontSize(20).text('Albarán', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`ID: ${deliveryNote._id}`);
  doc.text(`Proyecto: ${deliveryNote.project}`);
  doc.text(`Cliente: ${deliveryNote.client}`);
  doc.text(`Usuario: ${deliveryNote.user}`);
  doc.text(`Fecha: ${deliveryNote.workDate}`);
  doc.text(`Formato: ${deliveryNote.format}`);
  doc.moveDown();
  doc.text('Entradas:');
  deliveryNote.entries.forEach((entry, i) => {
    doc.text(`${i + 1}. ${entry.description || ''} ${entry.material || ''} ${entry.hours || ''}h ${entry.quantity || ''}`);
  });
  if (deliveryNote.signatureUrl) {
    doc.moveDown();
    doc.text('Firma:');
    doc.image(deliveryNote.signatureUrl, { width: 100 });
  }
  doc.end();
  // Espera a que el PDF se escriba
  await new Promise(resolve => doc.on('finish', resolve));
  // Sube el PDF (simulado)
  const url = await uploadToCloud(filePath);
  // Borra el archivo temporal
  fs.unlinkSync(filePath);
  return url;
}

export async function downloadPDF(id, user, res) {
  const deliveryNote = await DeliveryNote.findOne({ _id: id, company: user.company });
  if (!deliveryNote) throw new AppError('Albarán no encontrado', 404);
  if (!deliveryNote.pdfUrl) throw new AppError('PDF no disponible', 404);
  // Simulación: redirige a la URL del PDF
  res.redirect(deliveryNote.pdfUrl);
}
