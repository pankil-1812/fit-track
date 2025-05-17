import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { AppError } from '../utils/errorUtils';

/**
 * Middleware to validate inputs using express-validator
 * @param validations - Array of validation chains
 */
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Execute all validations
    await Promise.all(validations.map(validation => validation.run(req)));
    
    // Check for validation errors
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      // Format errors for consistent response
      const errorMessages = errors.array().map(err => ({
        type: err.type,
        message: err.msg
      }));
      
      return next(new AppError(`Validation failed: ${errorMessages[0].message}`, 400));
    }
    
    next();
  };
};
