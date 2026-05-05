
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

/**
 * Genera un PDF de un albarán con todos los datos relevantes.
 * @param {object} deliveryNote - Documento de albarán (con populate de user, client, project)
 * @param {string} [signatureUrl] - URL de la firma (opcional)
 * @param {string} [outputPath] - Ruta donde guardar el PDF (opcional, por defecto en /tmp)
 * @returns {Promise<string>} - Ruta local del PDF generado
 */
export async function generateDeliveryNotePDF(deliveryNote, signatureUrl, outputPath) {
	const fileName = `deliverynote-${deliveryNote._id}.pdf`;
	const filePath = outputPath || path.join('/tmp', fileName);
	return new Promise((resolve, reject) => {
		const doc = new PDFDocument({ margin: 40 });
		const stream = fs.createWriteStream(filePath);
		doc.pipe(stream);

		// Cabecera
		doc.fontSize(20).text('Albarán', { align: 'center' });
		doc.moveDown();

		// Datos del albarán
		doc.fontSize(12);
		doc.text(`ID: ${deliveryNote._id}`);
		doc.text(`Fecha: ${deliveryNote.workDate ? new Date(deliveryNote.workDate).toLocaleDateString() : ''}`);
		doc.text(`Tipo: ${deliveryNote.format}`);
		doc.text(`Firmado: ${deliveryNote.signed ? 'Sí' : 'No'}`);
		doc.moveDown();

		// Proyecto
		if (deliveryNote.project) {
			doc.text('Proyecto:', { underline: true });
			doc.text(`Nombre: ${deliveryNote.project.name}`);
			doc.text(`Descripción: ${deliveryNote.project.description || ''}`);
			doc.moveDown();
		}

		// Cliente
		if (deliveryNote.client) {
			doc.text('Cliente:', { underline: true });
			doc.text(`Nombre: ${deliveryNote.client.name}`);
			doc.text(`Email: ${deliveryNote.client.email || ''}`);
			doc.moveDown();
		}

		// Usuario
		if (deliveryNote.user) {
			doc.text('Usuario:', { underline: true });
			doc.text(`Nombre: ${deliveryNote.user.name}`);
			doc.text(`Email: ${deliveryNote.user.email}`);
			doc.moveDown();
		}

		// Materiales u horas
		if (deliveryNote.format === 'material' && deliveryNote.materials && deliveryNote.materials.length) {
			doc.text('Materiales entregados:', { underline: true });
			deliveryNote.materials.forEach((mat, i) => {
				doc.text(`${i + 1}. ${mat.name} - ${mat.qty} ${mat.unit}`);
			});
			doc.moveDown();
		}
		if (deliveryNote.format === 'hours' && deliveryNote.hours && deliveryNote.hours.length) {
			doc.text('Horas trabajadas:', { underline: true });
			deliveryNote.hours.forEach((h, i) => {
				doc.text(`${i + 1}. ${h.worker} - ${h.qty}h (${h.description || ''})`);
			});
			doc.moveDown();
		}

		// Firma
		if (signatureUrl || deliveryNote.signatureUrl) {
			doc.text('Firma:', { underline: true });
			const url = signatureUrl || deliveryNote.signatureUrl;
			// Si la firma es una imagen local, intentar insertarla
			if (url && (url.startsWith('/') || url.startsWith('C:'))) {
				try {
					doc.image(url, { width: 120 });
				} catch (e) {
					doc.text('[No se pudo cargar la imagen de la firma]');
				}
			} else if (url) {
				doc.text(`URL: ${url}`);
			}
			doc.moveDown();
		}

		doc.end();
		stream.on('finish', () => resolve(filePath));
		stream.on('error', reject);
	});
}
