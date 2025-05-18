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

/**
 * Middleware to validate request data
 */
export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Get all validation errors
        const validationErrors = errors.array();
        
        // Create a map of field:error messages for cleaner output
        const errorMap = new Map<string, string>();
        validationErrors.forEach((error) => {
            // Handle both newer path-based and older param-based errors
            const field = typeof error === 'object' && 'path' in error 
                ? String(error.path)
                : (error as any).param || 'unknown';
            
            if (!errorMap.has(field)) {
                errorMap.set(field, error.msg);
            }
        });

        // Create a single error message with all field errors
        const errorMessages = Array.from(errorMap.values());
        return next(new AppError(errorMessages.join(', '), 400));
    }
    next();
};
