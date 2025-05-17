import { Request, Response, NextFunction } from 'express';
import { User, IUser } from '../models/userModel';
import { asyncHandler, AppError } from '../utils/errorUtils';

/**
 * @desc    Get all users
 * @route   GET /api/v1/users
 * @access  Private/Admin
 */
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  // Pagination
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const startIndex = (page - 1) * limit;
  
  // Query
  const users = await User.find().skip(startIndex).limit(limit);
  const total = await User.countDocuments();
  
  res.status(200).json({
    success: true,
    count: users.length,
    total,
    pagination: {
      current: page,
      pages: Math.ceil(total / limit)
    },
    data: users
  });
});

/**
 * @desc    Get single user
 * @route   GET /api/v1/users/:id
 * @access  Private/Admin
 */
export const getUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return next(new AppError(`User not found with id ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    data: user
  });
});

/**
 * @desc    Create user
 * @route   POST /api/v1/users
 * @access  Private/Admin
 */
export const createUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.create(req.body);
  
  res.status(201).json({
    success: true,
    data: user
  });
});

/**
 * @desc    Update user
 * @route   PUT /api/v1/users/:id
 * @access  Private/Admin
 */
export const updateUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  if (!user) {
    return next(new AppError(`User not found with id ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    data: user
  });
});

/**
 * @desc    Delete user
 * @route   DELETE /api/v1/users/:id
 * @access  Private/Admin
 */
export const deleteUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return next(new AppError(`User not found with id ${req.params.id}`, 404));
  }
  
  // Soft delete by setting active to false
  user.active = false;
  await user.save();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

/**
 * @desc    Update privacy settings
 * @route   PUT /api/v1/users/privacy
 * @access  Private
 */
export const updatePrivacySettings = asyncHandler(async (req: Request, res: Response) => {
  const { profileVisibility, activityVisibility, showInLeaderboards } = req.body;
  
  const user = await User.findByIdAndUpdate(
    req.user!._id,
    {
      privacySettings: {
        profileVisibility,
        activityVisibility,
        showInLeaderboards
      }
    },
    { new: true, runValidators: true }
  );
  
  res.status(200).json({
    success: true,
    data: user
  });
});

/**
 * @desc    Upload profile picture
 * @route   PUT /api/v1/users/profile-picture
 * @access  Private
 */
export const uploadProfilePicture = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // In a real app, we would handle file upload here
  // For this example, we'll just update the profile picture URL
  
  if (!req.body.profilePicture) {
    return next(new AppError('Please provide a profile picture URL', 400));
  }
  
  const user = await User.findByIdAndUpdate(
    req.user!._id,
    { profilePicture: req.body.profilePicture },
    { new: true }
  );
  
  res.status(200).json({
    success: true,
    data: user
  });
});

/**
 * @desc    Get user by username or email
 * @route   GET /api/v1/users/search
 * @access  Private
 */
export const searchUsers = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query.q as string;
  
  if (!query) {
    return res.status(200).json({
      success: true,
      count: 0,
      data: []
    });
  }
  
  const users = await User.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } }
    ]
  }).limit(20);
  
  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});
