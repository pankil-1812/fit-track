import jwt from 'jsonwebtoken';
import { Request } from 'express';

interface JwtPayload {
    id: string;
    iat?: number;
    exp?: number;
}

/**
 * Generate JWT token
 * @param id - User ID to include in the payload
 * @param expiresIn - Token expiration (default: from env or 7d)
 * @returns JWT token string
 */
export const generateToken = (id: string, expiresIn?: string | number): string => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET! as string,
        {
            expiresIn: '7d'
        }
    );
};

/**
 * Generate refresh token
 * @param id - User ID to include in the payload
 * @returns JWT refresh token string
 */
export const generateRefreshToken = (id: string): string => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET as string,
        {
            expiresIn: '30d' // Refresh token has a longer lifespan
        }
    );
};

/**
 * Verify JWT token and return payload
 * @param token - JWT token to verify
 * @returns Decoded token payload or null if invalid
 */
export const verifyToken = (token: string): JwtPayload | null => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    } catch (err) {
        return null;
    }
};

/**
 * Get token from request headers or cookies
 * @param req - Express request object
 * @returns Token string or null if not found
 */
export const getTokenFromRequest = (req: Request): string | null => {
    let token: string | null = null;

    // Check Authorization header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Get token from header
        token = req.headers.authorization.split(' ')[1];
    }
    // Check cookies
    else if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    return token;
};

/**
 * Create and send token response with cookie
 * @param user - User object 
 * @param statusCode - HTTP status code
 * @param req - Express request object
 * @param res - Express response object
 */
export const sendTokenResponse = (
    user: any,
    statusCode: number,
    req: Request,
    res: any
): void => {
    // Create token
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    const cookieOptions = {
        expires: new Date(
            Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN || '7') * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
        sameSite: 'strict' as const
    };

    res
        .status(statusCode)
        .cookie('jwt', token, cookieOptions)
        .json({
            success: true,
            token,
            refreshToken
        });
};
