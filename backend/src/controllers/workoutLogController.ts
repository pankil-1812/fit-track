import { Request, Response, NextFunction } from 'express';
import { WorkoutLog } from '../models/workoutLogModel';
import { Routine } from '../models/routineModel';
import { asyncHandler, AppError } from '../utils/errorUtils';

/**
 * @desc    Get all workout logs for current user
 * @route   GET /api/v1/workout-logs
 * @access  Private
 */
export const getWorkoutLogs = asyncHandler(async (req: Request, res: Response) => {
    const logs = await WorkoutLog.find({ user: req.user!._id })
        .sort({ startTime: -1 })
        .populate('routine', 'title category');

    res.status(200).json({
        success: true,
        data: logs
    });
});

/**
 * @desc    Get workout logs for a specific date
 * @route   GET /api/v1/workout-logs/date/:date
 * @access  Private
 */
export const getWorkoutLogsByDate = asyncHandler(async (req: Request, res: Response) => {
    const date = new Date(req.params.date);
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);

    const logs = await WorkoutLog.find({
        user: req.user!._id,
        startTime: {
            $gte: date,
            $lt: nextDate
        }
    }).populate('routine', 'title category');

    res.status(200).json({
        success: true,
        data: logs
    });
});

/**
 * @desc    Get workout logs for a specific routine
 * @route   GET /api/v1/workout-logs/routine/:routineId
 * @access  Private
 */
export const getWorkoutLogsByRoutine = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const routine = await Routine.findById(req.params.routineId);
    
    if (!routine) {
        return next(new AppError(`Routine not found with id ${req.params.routineId}`, 404));
    }

    // Users can only see their own logs or logs for public routines
    const query = {
        routine: req.params.routineId,
        $or: [
            { user: req.user!._id },
            { 'routine.isPublic': true }
        ]
    };

    const logs = await WorkoutLog.find(query)
        .sort({ startTime: -1 })
        .populate('routine', 'title category isPublic');

    res.status(200).json({
        success: true,
        data: logs
    });
});

/**
 * @desc    Create a new workout log
 * @route   POST /api/v1/workout-logs
 * @access  Private
 */
export const createWorkoutLog = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const routine = await Routine.findById(req.body.routine);
    
    if (!routine) {
        return next(new AppError(`Routine not found with id ${req.body.routine}`, 404));
    }

    // Set user
    req.body.user = req.user!._id;

    const workoutLog = await WorkoutLog.create(req.body);
    
    res.status(201).json({
        success: true,
        data: workoutLog
    });
});

/**
 * @desc    Update workout log
 * @route   PUT /api/v1/workout-logs/:id
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
 * @route   DELETE /api/v1/workout-logs/:id
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

    res.status(200).json({
        success: true,
        data: {}
    });
});

/**
 * @desc    Get workout statistics
 * @route   GET /api/v1/workout-logs/stats
 * @access  Private
 */
export const getWorkoutStats = asyncHandler(async (req: Request, res: Response) => {
    const [workoutStats, routineStats] = await Promise.all([
        // Overall workout stats
        WorkoutLog.aggregate([
            { $match: { user: req.user!._id } },
            {
                $group: {
                    _id: null,
                    totalWorkouts: { $sum: 1 },
                    totalDuration: { $sum: '$duration' },
                    totalExercises: { $sum: { $size: '$exercises' } }
                }
            }
        ]),

        // Most used routines
        WorkoutLog.aggregate([
            { $match: { user: req.user!._id } },
            {
                $group: {
                    _id: '$routine',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'routines',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'routine'
                }
            },
            { $unwind: '$routine' },
            {
                $project: {
                    _id: 0,
                    routine: '$routine',
                    count: 1
                }
            }
        ])
    ]);

    const stats = workoutStats[0] || {
        totalWorkouts: 0,
        totalDuration: 0,
        totalExercises: 0
    };

    res.status(200).json({
        success: true,
        data: {
            ...stats,
            frequentRoutines: routineStats
        }
    });
});
