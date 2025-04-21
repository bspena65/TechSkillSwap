import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../uploads');

    // Verifica si la carpeta existe
    if (!fs.existsSync(uploadPath)) {
      // Si la carpeta no existe, la crea
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // Usa la ruta de la carpeta de uploads
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

// Middleware de subida de archivos con Multer
export const upload = multer({ storage });
