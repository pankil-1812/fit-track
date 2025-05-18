import { Request, Response, NextFunction } from 'express';
import { Analytics, IAnalytics } from '../models/analyticsModel';
import { IWorkoutLog, WorkoutLog, SchemaObjectId } from '../models/workoutLogModel';
import { asyncHandler, AppError } from '../utils/errorUtils';

/**
 * @desc    Get user analytics overview
 * @route   GET /api/v1/analytics/overview
 * @access  Private
 */
export const getAnalyticsOverview = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let analytics = await Analytics.findOne({ user: req.user!._id });

    if (!analytics) {
        // Create new analytics record if it doesn't exist
        analytics = await Analytics.create({ user: req.user!._id });
    }

    res.status(200).json({
        success: true,
        data: analytics
    });
});

/**
 * @desc    Get user daily stats
 * @route   GET /api/v1/analytics/daily
 * @access  Private
 */
export const getDailyStats = asyncHandler(async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query;

    // Default to last 30 days if no date range provided
    const end = endDate ? new Date(endDate as string) : new Date();
    const start = startDate
        ? new Date(startDate as string)
        : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

    const analytics = await Analytics.findOne({ user: req.user!._id });

    if (!analytics) {
        return res.status(200).json({
            success: true,
            data: []
        });
    }

    // Filter daily stats within date range
    const dailyStats = analytics.dailyStats.filter(stat => {
        const statDate = new Date(stat.date);
        return statDate >= start && statDate <= end;
    });

    // Sort by date ascending
    dailyStats.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    res.status(200).json({
        success: true,
        data: dailyStats
    });
});

/**
 * @desc    Get body measurements history
 * @route   GET /api/v1/analytics/body-measurements
 * @access  Private
 */
export const getBodyMeasurements = asyncHandler(async (req: Request, res: Response) => {
    const analytics = await Analytics.findOne({ user: req.user!._id });

    if (!analytics || !analytics.bodyMeasurements) {
        return res.status(200).json({
            success: true,
            data: []
        });
    }

    // Sort measurements by date descending (newest first)
    const measurements = [...analytics.bodyMeasurements].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    res.status(200).json({
        success: true,
        data: measurements
    });
});

/**
 * @desc    Add body measurement
 * @route   POST /api/v1/analytics/body-measurements
 * @access  Private
 */
export const addBodyMeasurement = asyncHandler(async (req: Request, res: Response) => {
    let analytics = await Analytics.findOne({ user: req.user!._id });

    if (!analytics) {
        analytics = await Analytics.create({ user: req.user!._id });
    }

    // Add new measurement with current date
    const newMeasurement = {
        ...req.body,
        date: new Date()
    };

    analytics.bodyMeasurements.push(newMeasurement);
    await analytics.save();

    res.status(201).json({
        success: true,
        data: newMeasurement
    });
});

/**
 * @desc    Add fitness score
 * @route   POST /api/v1/analytics/fitness-scores
 * @access  Private
 */
export const addFitnessScore = asyncHandler(async (req: Request, res: Response) => {
    let analytics = await Analytics.findOne({ user: req.user!._id });

    if (!analytics) {
        analytics = await Analytics.create({ user: req.user!._id });
    }

    // Calculate overall score as average of individual scores
    const { strength, cardio, flexibility, consistency } = req.body;
    const overall = Math.round((strength + cardio + flexibility + consistency) / 4);

    // Add new fitness score with current date
    const newScore = {
        date: new Date(),
        overall,
        strength,
        cardio,
        flexibility,
        consistency
    };

    analytics.fitnessScores.push(newScore);
    await analytics.save();

    res.status(201).json({
        success: true,
        data: newScore
    });
});

/**
 * @desc    Get fitness scores history
 * @route   GET /api/v1/analytics/fitness-scores
 * @access  Private
 */
export const getFitnessScores = asyncHandler(async (req: Request, res: Response) => {
    const analytics = await Analytics.findOne({ user: req.user!._id });

    if (!analytics || !analytics.fitnessScores) {
        return res.status(200).json({
            success: true,
            data: []
        });
    }

    // Sort scores by date descending (newest first)
    const scores = [...analytics.fitnessScores].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    res.status(200).json({
        success: true,
        data: scores
    });
});

/**
 * @desc    Add achievement
 * @route   POST /api/v1/analytics/achievements
 * @access  Private
 */
export const addAchievement = asyncHandler(async (req: Request, res: Response) => {
    let analytics = await Analytics.findOne({ user: req.user!._id });

    if (!analytics) {
        analytics = await Analytics.create({ user: req.user!._id });
    }

    // Add achievement with unique ID and current date
    const newAchievement = {
        ...req.body,
        id: `ach_${Date.now()}`,
        earnedAt: new Date()
    };

    analytics.achievements.push(newAchievement);
    await analytics.save();

    res.status(201).json({
        success: true,
        data: newAchievement
    });
});

/**
 * @desc    Get achievements
 * @route   GET /api/v1/analytics/achievements
 * @access  Private
 */
export const getAchievements = asyncHandler(async (req: Request, res: Response) => {
    const analytics = await Analytics.findOne({ user: req.user!._id });

    if (!analytics || !analytics.achievements) {
        return res.status(200).json({
            success: true,
            data: []
        });
    }

    // Sort achievements by date earned
    const achievements = [...analytics.achievements].sort(
        (a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime()
    );

    res.status(200).json({
        success: true,
        data: achievements
    });
});

/**
 * @desc    Rebuild/recalculate user analytics
 * @route   POST /api/v1/analytics/rebuild
 * @access  Private
 */
export const rebuildAnalytics = asyncHandler(async (req: Request, res: Response) => {
    // Create or find user analytics
    let analytics = await Analytics.findOne({ user: req.user!._id });

    if (!analytics) {
        analytics = await Analytics.create({ user: req.user!._id });
    }

    // Reset analytics to defaults
    analytics.totalWorkouts = 0;
    analytics.totalDuration = 0;
    analytics.totalCaloriesBurned = 0;
    analytics.dailyStats = [];

    // Get all user workouts
    const workouts: IWorkoutLog[] = await WorkoutLog.find({ user: req.user!._id }).sort('createdAt');

    // Process workouts and rebuild analytics
    let lastWorkoutDate: Date | null = null;
    let streak = 0;
    let longestStreak = 0;

    for (const workout of workouts) {
        // Update totals
        analytics.totalWorkouts += 1;
        analytics.totalDuration += workout.duration;
        analytics.totalCaloriesBurned += workout.caloriesBurned ?? 0;

        // Update streak
        const workoutDate = new Date(workout.createdAt);
        workoutDate.setHours(0, 0, 0, 0);

        if (lastWorkoutDate) {
            const yesterday = new Date(workoutDate);
            yesterday.setDate(yesterday.getDate() - 1);

            if (lastWorkoutDate.getTime() === yesterday.getTime()) {
                streak += 1;
            } else if (lastWorkoutDate.getTime() !== workoutDate.getTime()) {
                streak = 1;
            }
        } else {
            streak = 1;
        }

        // Update longest streak if current streak is longer
        if (streak > longestStreak) {
            longestStreak = streak;
        }

        // Set last workout date for next iteration
        lastWorkoutDate = workoutDate;

        // Update daily stats
        const dateString = workoutDate.toISOString().split('T')[0];
        const existingDailyStat = analytics.dailyStats.find(
            (stat) => new Date(stat.date).toISOString().split('T')[0] === dateString
        );

        if (existingDailyStat) {
            existingDailyStat.workoutCount += 1;
            existingDailyStat.totalDuration += workout.duration;
            existingDailyStat.caloriesBurned += workout.caloriesBurned ?? 0;
            existingDailyStat.workouts.push(workout._id as unknown as SchemaObjectId);
        } else {
            analytics.dailyStats.push({
                date: workoutDate,
                workoutCount: 1,
                totalDuration: workout.duration,
                caloriesBurned: workout.caloriesBurned ?? 0,
                workouts: [workout._id as unknown as SchemaObjectId]
            });
        }
    }

    // Update streak information
    analytics.workoutStreak = streak;
    analytics.longestStreak = longestStreak;
    analytics.lastWorkoutDate = lastWorkoutDate || new Date();

    // Update weekly summary
    // Get current week's start date (Sunday)
    const today = new Date();
    const currentWeekStart = new Date(today);
    currentWeekStart.setDate(today.getDate() - today.getDay());
    currentWeekStart.setHours(0, 0, 0, 0);

    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
    currentWeekEnd.setHours(23, 59, 59, 999);

    // Get workouts for current week
    const currentWeekWorkouts = workouts.filter(workout => {
        const date = new Date(workout.createdAt);
        return date >= currentWeekStart && date <= currentWeekEnd;
    });

    // Calculate weekly summary
    analytics.weeklyActivitySummary = {
        startDate: currentWeekStart,
        endDate: currentWeekEnd,
        workoutCount: currentWeekWorkouts.length,
        totalDuration: currentWeekWorkouts.reduce((sum, w) => sum + w.duration, 0),
        caloriesBurned: currentWeekWorkouts.reduce((sum, w) => sum + (w.caloriesBurned ?? 0), 0),
        workouts: currentWeekWorkouts.map(w => w._id as unknown as SchemaObjectId)
    };

    await analytics.save();

    res.status(200).json({
        success: true,
        data: analytics
    });
});
