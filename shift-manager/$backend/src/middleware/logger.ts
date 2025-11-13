import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  // Log method, URL, and IP
  logger.http(`${req.method} ${req.url} - ${req.ip}`);
  
  // Get the original send function
  const originalSend = res.send;
  
  // Override the send function to log the response status
  res.send = function (body) {
    logger.http(`Response: ${res.statusCode}`);
    return originalSend.call(this, body);
  };
  
  next();
};

export default requestLogger; 