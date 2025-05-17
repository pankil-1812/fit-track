import mongoose from 'mongoose';

export interface IDailyStats {
    date: Date;
    workoutCount: number;
    totalDuration: number; // in minutes
    caloriesBurned: number;
    workouts: mongoose.Schema.Types.ObjectId[];
}

export interface IBodyMeasurement {
    date: Date;
    weight: number;
    bodyFat?: number;
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    thighs?: number;
    notes?: string;
}

export interface IAnalytics extends mongoose.Document {
    user: mongoose.Schema.Types.ObjectId;
    totalWorkouts: number;
    totalDuration: number; // in minutes
    totalCaloriesBurned: number;
    workoutStreak: number;
    longestStreak: number;
    lastWorkoutDate: Date;
    weeklyActivitySummary: {
        startDate: Date;
        endDate: Date;
        workoutCount: number;
        totalDuration: number;
        caloriesBurned: number;
        workouts: mongoose.Schema.Types.ObjectId[];
    };
    dailyStats: IDailyStats[];
    bodyMeasurements: IBodyMeasurement[];
    fitnessScores: {
        date: Date;
        overall: number; // 0-100
        strength: number;
        cardio: number;
        flexibility: number;
        consistency: number;
    }[];
    achievements: {
        id: string;
        name: string;
        description: string;
        earnedAt: Date;
        icon: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
    addWorkout(workout: any): Promise<void>;
}

const DailyStatsSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    workoutCount: {
        type: Number,
        default: 0
    },
    totalDuration: {
        type: Number,
        default: 0
    },
    caloriesBurned: {
        type: Number,
        default: 0
    },
    workouts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'WorkoutLog'
        }
    ]
});

const BodyMeasurementSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    bodyFat: {
        type: Number
    },
    chest: {
        type: Number
    },
    waist: {
        type: Number
    },
    hips: {
        type: Number
    },
    arms: {
        type: Number
    },
    thighs: {
        type: Number
    },
    notes: {
        type: String
    }
});

const FitnessScoreSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    overall: {
        type: Number,
        min: 0,
        max: 100,
        default: 50
    },
    strength: {
        type: Number,
        min: 0,
        max: 100,
        default: 50
    },
    cardio: {
        type: Number,
        min: 0,
        max: 100,
        default: 50
    },
    flexibility: {
        type: Number,
        min: 0,
        max: 100,
        default: 50
    },
    consistency: {
        type: Number,
        min: 0,
        max: 100,
        default: 50
    }
});

const AchievementSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    earnedAt: {
        type: Date,
        default: Date.now
    },
    icon: {
        type: String,
        required: true
    }
});

const AnalyticsSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Analytics must belong to a user'],
            unique: true
        },
        totalWorkouts: {
            type: Number,
            default: 0
        },
        totalDuration: {
            type: Number,
            default: 0
        },
        totalCaloriesBurned: {
            type: Number,
            default: 0
        },
        workoutStreak: {
            type: Number,
            default: 0
        },
        longestStreak: {
            type: Number,
            default: 0
        },
        lastWorkoutDate: {
            type: Date
        },
        weeklyActivitySummary: {
            startDate: {
                type: Date
            },
            endDate: {
                type: Date
            },
            workoutCount: {
                type: Number,
                default: 0
            },
            totalDuration: {
                type: Number,
                default: 0
            },
            caloriesBurned: {
                type: Number,
                default: 0
            },
            workouts: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'WorkoutLog'
                }
            ]
        },
        dailyStats: [DailyStatsSchema],
        bodyMeasurements: [BodyMeasurementSchema],
        fitnessScores: [FitnessScoreSchema],
        achievements: [AchievementSchema]
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Populate user reference
AnalyticsSchema.pre(/^find/, function (this: mongoose.Query<any, any>, next) {
    this.populate({
        path: 'user',
        select: 'name profilePicture'
    });
    next();
});

// Update stats when a new workout is added
AnalyticsSchema.methods.addWorkout = async function (workout: any) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Update total stats
    this.totalWorkouts += 1;
    this.totalDuration += workout.duration;
    this.totalCaloriesBurned += workout.caloriesBurned;
    this.lastWorkoutDate = workout.createdAt;

    // Check and update streak
    const lastDate = this.lastWorkoutDate ? new Date(this.lastWorkoutDate) : null;
    if (lastDate) {
        lastDate.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastDate.getTime() === yesterday.getTime()) {
            this.workoutStreak += 1;
        } else if (lastDate.getTime() !== today.getTime()) {
            this.workoutStreak = 1;
        }
    } else {
        this.workoutStreak = 1;
    }

    // Update longest streak if needed
    if (this.workoutStreak > this.longestStreak) {
        this.longestStreak = this.workoutStreak;
    }

    // Update or add daily stats
    const todayStats = this.dailyStats.find(
        (stat: any) => new Date(stat.date).getTime() === today.getTime()
    );

    if (todayStats) {
        todayStats.workoutCount += 1;
        todayStats.totalDuration += workout.duration;
        todayStats.caloriesBurned += workout.caloriesBurned;
        todayStats.workouts.push(workout._id);
    } else {
        this.dailyStats.push({
            date: today,
            workoutCount: 1,
            totalDuration: workout.duration,
            caloriesBurned: workout.caloriesBurned,
            workouts: [workout._id]
        });
    }

    // Update weekly summary
    const currentWeekStart = new Date(today);
    currentWeekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
    currentWeekStart.setHours(0, 0, 0, 0);

    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekStart.getDate() + 6); // End of week (Saturday)
    currentWeekEnd.setHours(23, 59, 59, 999);

    // If we need to create a new weekly summary
    if (!this.weeklyActivitySummary.startDate ||
        new Date(this.weeklyActivitySummary.startDate).getTime() !== currentWeekStart.getTime()) {
        this.weeklyActivitySummary = {
            startDate: currentWeekStart,
            endDate: currentWeekEnd,
            workoutCount: 1,
            totalDuration: workout.duration,
            caloriesBurned: workout.caloriesBurned,
            workouts: [workout._id]
        };
    } else {
        this.weeklyActivitySummary.workoutCount += 1;
        this.weeklyActivitySummary.totalDuration += workout.duration;
        this.weeklyActivitySummary.caloriesBurned += workout.caloriesBurned;
        this.weeklyActivitySummary.workouts.push(workout._id);
    }

    await this.save();
};

export const Analytics = mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);
