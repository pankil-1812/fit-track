import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { User } from '../models/userModel';
import { asyncHandler, AppError } from '../utils/errorUtils';
import { sendTokenResponse, generateToken, verifyToken } from '../utils/jwtUtils';
import { Analytics } from '../models/analyticsModel';

/**
 * @desc    Register a new user
 * @route   POST /api/v1/users/register
 * @access  Public
 */
export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return next(new AppError('Email already in use', 400));
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password
    });

    // Create analytics profile for user
    await Analytics.create({
        user: user._id
    });

    // Send token response
    sendTokenResponse(user, 201, req, res);
});

/**
 * @desc    Login user
 * @route   POST /api/v1/users/login
 * @access  Public
 */
export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new AppError('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new AppError('Invalid credentials', 401));
    }

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
        // Return challenge for 2FA verification
        return res.status(200).json({
            success: true,
            message: '2FA required',
            userId: user._id,
            requiresTwoFactor: true
        });
    }

    // Send token response
    sendTokenResponse(user, 200, req, res);
});

/**
 * @desc    Verify 2FA token
 * @route   POST /api/v1/users/verify-2fa
 * @access  Public
 */
export const verifyTwoFactor = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { userId, token } = req.body;

    // Find user
    const user = await User.findById(userId).select('+twoFactorSecret');

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    // In a real app, you would verify the token against the user's secret
    // For this example, we'll simulate a successful verification
    const isVerified = token === '123456'; // Mock verification

    if (!isVerified) {
        return next(new AppError('Invalid authentication code', 401));
    }

    // Send token response
    sendTokenResponse(user, 200, req, res);
});

/**
 * @desc    Logout user / clear cookie
 * @route   GET /api/v1/users/logout
 * @access  Private
 */
export const logout = asyncHandler(async (req: Request, res: Response) => {
    res.cookie('jwt', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: 'Successfully logged out'
    });
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/v1/users/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // User already in req from auth middleware
    const user = req.user;

    res.status(200).json({
        success: true,
        data: user
    });
});

/**
 * @desc    Update user details
 * @route   PUT /api/v1/users/update-details
 * @access  Private
 */
export const updateDetails = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email,
        username: req.body.username, // Added
        bio: req.body.bio,
        height: req.body.height,
        weight: req.body.weight,
        dateOfBirth: req.body.dateOfBirth,
        gender: req.body.gender,
        fitnessGoal: req.body.fitnessGoal, // Added (singular)
        fitnessLevel: req.body.fitnessLevel, // Added
        fitnessGoals: req.body.fitnessGoals, // Keep for array support
        injuries: req.body.injuries,
        activityLevel: req.body.activityLevel
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => {
        if (fieldsToUpdate[key as keyof typeof fieldsToUpdate] === undefined) {
            delete fieldsToUpdate[key as keyof typeof fieldsToUpdate];
        }
    });

    const user = await User.findByIdAndUpdate(req.user!._id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: user
    });
});

/**
 * @desc    Update password
 * @route   PUT /api/v1/users/update-password
 * @access  Private
 */
export const updatePassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user!._id).select('+password');

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
        return next(new AppError('Current password is incorrect', 401));
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Send token response
    sendTokenResponse(user, 200, req, res);
});

/**
 * @desc    Forgot password
 * @route   POST /api/v1/users/forgot-password
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return next(new AppError('No user found with that email', 404));
    }

    // Get reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`;

    try {
        // In a real app, we would send an email here
        // For this example, we'll just return the reset URL

        res.status(200).json({
            success: true,
            message: 'Password reset link sent to email',
            resetUrl // Only for development, don't include this in production
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new AppError('Email could not be sent', 500));
    }
});

/**
 * @desc    Reset password
 * @route   PUT /api/v1/users/reset-password/:resetToken
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // Get hashed token
    const resetToken = req.params.resetToken;
    const hashedToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Find user with the token
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
        return next(new AppError('Invalid or expired token', 400));
    }

    // Set new password
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Send token response
    sendTokenResponse(user, 200, req, res);
});

/**
 * @desc    Refresh token
 * @route   POST /api/v1/users/refresh-token
 * @access  Public
 */
export const refreshToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return next(new AppError('Please provide refresh token', 400));
    }

    // Verify refresh token
    const decoded = verifyToken(refreshToken);

    if (!decoded) {
        return next(new AppError('Invalid refresh token', 401));
    }

    // Get user
    const user = await User.findById(decoded.id);

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    // Generate new token
    const newToken = generateToken(user._id.toString());

    res.status(200).json({
        success: true,
        token: newToken
    });
});
