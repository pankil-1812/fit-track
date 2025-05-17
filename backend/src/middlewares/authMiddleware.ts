import { Request, Response, NextFunction } from 'express';
import { User, IUser } from '../models/userModel';
import { AppError, asyncHandler } from '../utils/errorUtils';
import { getTokenFromRequest, verifyToken } from '../utils/jwtUtils';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

/**
 * Middleware to protect routes - ensures user is logged in
 */
export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // Get token from request
  const token = getTokenFromRequest(req);
  
  // Check if token exists
  if (!token) {
    return next(new AppError('Not authorized to access this route', 401));
  }
  
  // Verify token
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return next(new AppError('Not authorized to access this route', 401));
  }
  
  // Check if user still exists
  const user = await User.findById(decoded.id);
  
  if (!user) {
    return next(new AppError('User no longer exists', 401));
  }
  
  // Check if user changed password after token was issued
  if (decoded.iat && user.passwordChangedAt && user.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('Password recently changed, please log in again', 401));
  }
  
  // Add user to request
  req.user = user;
  next();
});

/**
 * Middleware to restrict access to specific roles
 * @param roles - Array of roles that can access the route
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('User not authenticated', 401));
    }
    
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Not authorized to perform this action', 403));
    }
    
    next();
  };
};
