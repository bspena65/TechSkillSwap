// Importa el paquete de nodemailer
import nodemailer from 'nodemailer';

// Crea un transporte de Nodemailer
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'tgrado370@gmail.com', // Tu email de Gmail
    pass: 'lhlf idrx ghim wihn', // Tu contraseña de Gmail (puedes usar contraseñas de aplicaciones si tienes la autenticación en dos pasos activada)
  },
});

