// src/services/socket.service.js
import { emitToCompany } from '../sockets/index.js';

let ioInstance = null;
export function setSocketInstance(io) {
  ioInstance = io;
}

export function notifyDeliveryNoteNew(companyId, deliveryNote) {
  if (ioInstance) emitToCompany(ioInstance, companyId, 'deliverynote:new', deliveryNote);
}
export function notifyDeliveryNoteSigned(companyId, deliveryNote) {
  if (ioInstance) emitToCompany(ioInstance, companyId, 'deliverynote:signed', deliveryNote);
}
export function notifyClientNew(companyId, client) {
  if (ioInstance) emitToCompany(ioInstance, companyId, 'client:new', client);
}
export function notifyProjectNew(companyId, project) {
  if (ioInstance) emitToCompany(ioInstance, companyId, 'project:new', project);
}
