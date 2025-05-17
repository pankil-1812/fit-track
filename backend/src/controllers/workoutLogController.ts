import { Request, Response, NextFunction } from 'express';
import { WorkoutLog, IWorkoutLog } from '../models/workoutLogModel';
import { Analytics } from '../models/analyticsModel';
import { asyncHandler, AppError } from '../utils/errorUtils';

/**
 * @desc    Get all workout logs for a user
 * @route   GET /api/v1/workouts
 * @access  Private
 */
export const getWorkoutLogs = asyncHandler(async (req: Request, res: Response) => {
    // Build query
    let query: any = { user: req.user!._id };

    // Date filtering
    if (req.query.startDate && req.query.endDate) {
        query.createdAt = {
            $gte: new Date(req.query.startDate as string),
            $lte: new Date(req.query.endDate as string)
        };
    } else if (req.query.startDate) {
        query.createdAt = { $gte: new Date(req.query.startDate as string) };
    } else if (req.query.endDate) {
        query.createdAt = { $lte: new Date(req.query.endDate as string) };
    }

    // If requesting a specific user's workouts (for admin or public profile)
    if (req.query.user) {
        query.user = req.query.user;
    }

    // Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const startIndex = (page - 1) * limit;

    // Execute query
    const logs = await WorkoutLog.find(query)
        .sort({ createdAt: -1 })
        .skip(startIndex)
        .limit(limit);

    // Get total count for pagination
    const total = await WorkoutLog.countDocuments(query);

    res.status(200).json({
        success: true,
        count: logs.length,
        total,
        pagination: {
            current: page,
            pages: Math.ceil(total / limit)
        },
        data: logs
    });
});

/**
 * @desc    Get single workout log
 * @route   GET /api/v1/workouts/:id
 * @access  Private
 */
export const getWorkoutLog = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const log = await WorkoutLog.findById(req.params.id);

    if (!log) {
        return next(new AppError(`Workout log not found with id ${req.params.id}`, 404));
    }

    // Make sure user owns the log or is admin
    if (
        log.user.toString() !== req.user!._id.toString() &&
        req.user!.role !== 'admin'
    ) {
        return next(new AppError('Not authorized to access this workout log', 403));
    }

    res.status(200).json({
        success: true,
        data: log
    });
});

/**
 * @desc    Create workout log
 * @route   POST /api/v1/workouts
 * @access  Private
 */
export const createWorkoutLog = asyncHandler(async (req: Request, res: Response) => {
    // Set user to logged in user
    req.body.user = req.user!._id;

    const log = await WorkoutLog.create(req.body);

    // Update analytics with new workout data
    try {
        let analytics = await Analytics.findOne({ user: req.user!._id });

        if (!analytics) {
            // Create new analytics for user if it doesn't exist
            analytics = await Analytics.create({ user: req.user!._id });
        }

        // Update analytics with the new workout log
        await analytics.addWorkout(log);
    } catch (err) {
        console.error('Error updating analytics:', err);
        // Don't fail the request if analytics update fails
    }

    res.status(201).json({
        success: true,
        data: log
    });
});

/**
 * @desc    Update workout log
 * @route   PUT /api/v1/workouts/:id
 * @access  Private
 */
export const updateWorkoutLog = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let log = await WorkoutLog.findById(req.params.id);

    if (!log) {
        return next(new AppError(`Workout log not found with id ${req.params.id}`, 404));
    }

    // Make sure user owns the log
    if (log.user.toString() !== req.user!._id.toString()) {
        return next(new AppError('Not authorized to update this workout log', 403));
    }

    log = await WorkoutLog.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: log
    });
});

/**
 * @desc    Delete workout log
 * @route   DELETE /api/v1/workouts/:id
 * @access  Private
 */
export const deleteWorkoutLog = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const log = await WorkoutLog.findById(req.params.id);

    if (!log) {
        return next(new AppError(`Workout log not found with id ${req.params.id}`, 404));
    }

    // Make sure user owns the log
    if (log.user.toString() !== req.user!._id.toString()) {
        return next(new AppError('Not authorized to delete this workout log', 403));
    }

    await log.deleteOne();

    // Note: In a real app, you would also update analytics when a workout is deleted
    // But for this example, we'll keep it simple

    res.status(200).json({
        success: true,
        data: {}
    });
});

/**
 * @desc    Get workout statistics for a date range
 * @route   GET /api/v1/workouts/stats
 * @access  Private
 */
export const getWorkoutStats = asyncHandler(async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query;

    // Default to last 30 days if no date range provided
    const end = endDate ? new Date(endDate as string) : new Date();
    const start = startDate
        ? new Date(startDate as string)
        : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Query logs within date range
    const logs = await WorkoutLog.find({
        user: req.user!._id,
        createdAt: { $gte: start, $lte: end }
    });

    // Calculate statistics
    const totalWorkouts = logs.length;
    const totalDuration = logs.reduce((sum, log) => sum + log.duration, 0);
    const totalCaloriesBurned = logs.reduce((sum, log) => sum + log.caloriesBurned, 0);

    // Group by date
    const workoutsByDate: Record<string, number> = {};
    logs.forEach(log => {
        const dateKey = log.createdAt.toISOString().split('T')[0];
        workoutsByDate[dateKey] = (workoutsByDate[dateKey] || 0) + 1;
    });

    res.status(200).json({
        success: true,
        data: {
            totalWorkouts,
            totalDuration,
            totalCaloriesBurned,
            averageDuration: totalWorkouts > 0 ? totalDuration / totalWorkouts : 0,
            workoutsByDate
        }
    });
});
