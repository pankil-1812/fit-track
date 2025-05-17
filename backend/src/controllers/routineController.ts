import { Request, Response, NextFunction } from 'express';
import { Routine, IRoutine } from '../models/routineModel';
import { asyncHandler, AppError } from '../utils/errorUtils';
import mongoose from 'mongoose';

/**
 * @desc    Get all routines
 * @route   GET /api/v1/routines
 * @access  Private
 */
export const getRoutines = asyncHandler(async (req: Request, res: Response) => {
    // Build query
    const query: any = {};

    // Filtering
    if (req.query.difficulty) {
        query.difficulty = req.query.difficulty;
    }

    if (req.query.category) {
        query.category = req.query.category;
    }

    // Show only user's routines or public ones
    query.$or = [
        { user: req.user!._id },
        { isPublic: true }
    ];

    if (req.query.user) {
        // If requesting a specific user's routines
        query.user = req.query.user;
        delete query.$or;

        // If not the owner, only show public routines
        if (req.query.user.toString() !== req.user!._id.toString()) {
            query.isPublic = true;
        }
    }

    // Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const startIndex = (page - 1) * limit;

    // Execute query
    const routines = await Routine.find(query)
        .sort({ createdAt: -1 })
        .skip(startIndex)
        .limit(limit);

    // Get total count for pagination
    const total = await Routine.countDocuments(query);

    res.status(200).json({
        success: true,
        count: routines.length,
        total,
        pagination: {
            current: page,
            pages: Math.ceil(total / limit)
        },
        data: routines
    });
});

/**
 * @desc    Get single routine
 * @route   GET /api/v1/routines/:id
 * @access  Private
 */
export const getRoutine = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const routine = await Routine.findById(req.params.id);

    if (!routine) {
        return next(new AppError(`Routine not found with id ${req.params.id}`, 404));
    }

    // Check if user has access to this routine
    if (
        !routine.isPublic &&
        routine.user._id.toString() !== req.user!._id.toString()
    ) {
        return next(new AppError('Not authorized to access this routine', 403));
    }

    res.status(200).json({
        success: true,
        data: routine
    });
});

/**
 * @desc    Create routine
 * @route   POST /api/v1/routines
 * @access  Private
 */
export const createRoutine = asyncHandler(async (req: Request, res: Response) => {
    // Set user to logged in user
    req.body.user = req.user!._id;

    const routine = await Routine.create(req.body);

    res.status(201).json({
        success: true,
        data: routine
    });
});

/**
 * @desc    Update routine
 * @route   PUT /api/v1/routines/:id
 * @access  Private
 */
export const updateRoutine = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let routine = await Routine.findById(req.params.id);

    if (!routine) {
        return next(new AppError(`Routine not found with id ${req.params.id}`, 404));
    }

    // Make sure user owns the routine
    if (routine.user._id.toString() !== req.user!._id.toString()) {
        return next(new AppError('Not authorized to update this routine', 403));
    }

    // Update routine
    routine = await Routine.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: routine
    });
});

/**
 * @desc    Delete routine
 * @route   DELETE /api/v1/routines/:id
 * @access  Private
 */
export const deleteRoutine = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const routine = await Routine.findById(req.params.id);

    if (!routine) {
        return next(new AppError(`Routine not found with id ${req.params.id}`, 404));
    }

    // Make sure user owns the routine
    if (routine.user._id.toString() !== req.user!._id.toString()) {
        return next(new AppError('Not authorized to delete this routine', 403));
    }

    await routine.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});

/**
 * @desc    Like a routine
 * @route   PUT /api/v1/routines/:id/like
 * @access  Private
 */
export const likeRoutine = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const routine = await Routine.findById(req.params.id);

    if (!routine) {
        return next(new AppError(`Routine not found with id ${req.params.id}`, 404));
    }

    // Check if routine is already liked by user
    const isLiked = routine.likes.some(
        userId => userId.toString() === req.user!._id.toString()
    );

    if (isLiked) {
        // Unlike
        routine.likes = routine.likes.filter(
            userId => userId.toString() !== req.user!._id.toString()
        );
    } else {
        // Like
        routine.likes.push(req.user!._id as unknown as mongoose.Types.ObjectId);
    }

    await routine.save();

    res.status(200).json({
        success: true,
        liked: !isLiked,
        likeCount: routine.likes.length,
        data: routine
    });
});

/**
 * @desc    Save (bookmark) a routine
 * @route   PUT /api/v1/routines/:id/save
 * @access  Private
 */
export const saveRoutine = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const routine = await Routine.findById(req.params.id);

    if (!routine) {
        return next(new AppError(`Routine not found with id ${req.params.id}`, 404));
    }

    // Increment saves count
    routine.saves += 1;
    await routine.save();

    res.status(200).json({
        success: true,
        saveCount: routine.saves,
        data: routine
    });
});

/**
 * @desc    Search routines
 * @route   GET /api/v1/routines/search
 * @access  Private
 */
export const searchRoutines = asyncHandler(async (req: Request, res: Response) => {
    const query = req.query.q as string;

    if (!query) {
        return res.status(200).json({
            success: true,
            count: 0,
            data: []
        });
    }

    // Build search query
    const searchQuery = {
        $or: [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { tags: { $regex: query, $options: 'i' } }
        ],
        $and: [
            {
                $or: [
                    { user: req.user!._id },
                    { isPublic: true }
                ]
            }
        ]
    };

    const routines = await Routine.find(searchQuery).limit(20);

    res.status(200).json({
        success: true,
        count: routines.length,
        data: routines
    });
});
