// src/services/mail.service.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

export async function sendVerificationEmail(to, code) {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject: 'Código de verificación BildyApp',
    text: `Tu código de verificación es: ${code}`
  };
  await transporter.sendMail(mailOptions);
}
