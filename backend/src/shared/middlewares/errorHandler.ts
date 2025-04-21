// Manejo de errores
import { Request, Response, NextFunction } from 'express';
import { logger } from '../../infrastructure/logging/Logger';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);

  const errorResponse = {
    message: err.message,
    // Optional: include stack trace only in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  // Log the error
  logger.error(`${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  res.json(errorResponse);
};
