import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AppError, isOperationalError } from '../utils/errorUtils';

/**
 * Handle CastError from Mongoose (invalid ID format)
 */
const handleCastError = (err: mongoose.Error.CastError): AppError => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

/**
 * Handle duplicate key error from MongoDB
 */
const handleDuplicateFieldsError = (err: any): AppError => {
  const field = Object.keys(err.keyValue || {})[0];
  const value = err.keyValue?.[field];
  const message = `Duplicate field value entered for ${field}: ${value}. Please use another value.`;
  return new AppError(message, 400);
};

/**
 * Handle Mongoose validation errors
 */
const handleValidationError = (err: mongoose.Error.ValidationError): AppError => {
  const errors = Object.values(err.errors).map((error) => error.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

/**
 * Handle JWT errors
 */
const handleJWTError = (): AppError => {
  return new AppError('Invalid token. Please log in again.', 401);
};

/**
 * Handle JWT expired error
 */
const handleJWTExpiredError = (): AppError => {
  return new AppError('Your token has expired. Please log in again.', 401);
};

/**
 * Send error response for development environment
 */
const sendErrorDev = (err: AppError, res: Response): void => {
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

/**
 * Send error response for production environment
 */
const sendErrorProd = (err: AppError, res: Response): void => {
  // Operational, trusted error: send message to client
  if (isOperationalError(err)) {
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message
    });
  } 
  // Programming or other unknown error: don't leak details
  else {
    console.error('ERROR 💥', err);
    
    res.status(500).json({
      success: false,
      status: 'error',
      message: 'Something went wrong'
    });
  }
};

/**
 * Global error handler middleware
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err } as AppError;
  error.message = err.message;
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';
  
  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }
  
  // Mongoose CastError (invalid ID)
  if (err instanceof mongoose.Error.CastError) {
    error = handleCastError(err);
  }
  
  // Mongoose ValidationError
  if (err instanceof mongoose.Error.ValidationError) {
    error = handleValidationError(err);
  }
  
  // Mongoose duplicate key error
  if ((err as any).code === 11000) {
    error = handleDuplicateFieldsError(err);
  }
  
  // JWT errors
  if ((err as any).name === 'JsonWebTokenError') {
    error = handleJWTError();
  }
  
  // JWT expired error
  if ((err as any).name === 'TokenExpiredError') {
    error = handleJWTExpiredError();
  }
  
  // Send error response based on environment
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};
