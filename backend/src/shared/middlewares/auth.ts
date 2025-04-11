import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Obtener el token de los encabezados
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    // Verificar el token con la clave secreta
    const secretKey = process.env.JWT_SECRET || 'defaultSecretKey';
    const decoded = jwt.verify(token, secretKey);

    // Almacenar la información del usuario decodificado en la solicitud
    (req as any).user = decoded;

    // Continuar a la siguiente función middleware
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token no válido.' });
  }
};
