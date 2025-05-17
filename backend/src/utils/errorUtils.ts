/**
 * Custom error class for API errors with status code
 */
export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handler for async functions to avoid try/catch blocks
 */
export const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Create error with appropriate status code and message
 * @param message - Error message
 * @param statusCode - HTTP status code
 * @returns AppError instance
 */
export const createError = (message: string, statusCode: number = 500): AppError => {
  return new AppError(message, statusCode);
};

/**
 * Check if error is operational (expected) or programming error
 * @param err - Error to check
 * @returns boolean indicating if error is operational
 */
export const isOperationalError = (err: Error): boolean => {
  if (err instanceof AppError) {
    return err.isOperational;
  }
  return false;
};
