import mongoose from 'mongoose';

export interface IExerciseLog {
    exercise: string;
    sets: {
        weight: number;
        reps: number;
        duration: number; // in seconds
    }[];
    notes: string;
}

export interface IWorkoutLog extends mongoose.Document {
    _id: mongoose.Schema.Types.ObjectId;
    user: mongoose.Schema.Types.ObjectId;
    routine: mongoose.Schema.Types.ObjectId;
    title: string;
    exerciseLogs: IExerciseLog[];
    duration: number; // in minutes
    caloriesBurned: number;
    rating: number; // 1-5 scale
    notes: string;
    mood: string;
    feelingScore: number; // 1-10 scale
    mediaUrls: string[];
    location: {
        type: string;
        coordinates: number[];
    };
    createdAt: Date;
}

const ExerciseLogSchema = new mongoose.Schema({
    exercise: {
        type: String,
        required: [true, 'Exercise name is required']
    },
    sets: [
        {
            weight: {
                type: Number,
                default: 0
            },
            reps: {
                type: Number,
                default: 0
            },
            duration: {
                type: Number,
                default: 0
            }
        }
    ],
    notes: {
        type: String,
        default: ''
    }
});

const WorkoutLogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Workout log must belong to a user']
        },
        routine: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Routine'
            // Not required as user might create a custom workout on the fly
        },
        title: {
            type: String,
            required: [true, 'Please provide a workout title'],
            trim: true
        },
        exerciseLogs: [ExerciseLogSchema],
        duration: {
            type: Number,
            default: 0
        },
        caloriesBurned: {
            type: Number,
            default: 0
        },
        rating: {
            type: Number,
            min: [1, 'Rating must be at least 1'],
            max: [5, 'Rating cannot be more than 5'],
            default: 3
        },
        notes: {
            type: String,
            default: ''
        },
        mood: {
            type: String,
            enum: ['energetic', 'good', 'neutral', 'tired', 'exhausted', ''],
            default: ''
        },
        feelingScore: {
            type: Number,
            min: 1,
            max: 10,
            default: 5
        },
        mediaUrls: {
            type: [String],
            default: []
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number],
                default: [0, 0]
            }
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Create index for geolocation
WorkoutLogSchema.index({ location: '2dsphere' });

// Populate user and routine references
WorkoutLogSchema.pre(/^find/, function (this: mongoose.Query<any, any>, next) {
    this.populate({
        path: 'user',
        select: 'name profilePicture'
    }).populate({
        path: 'routine',
        select: 'title'
    });
    next();
});

export const WorkoutLog = mongoose.model<IWorkoutLog>('WorkoutLog', WorkoutLogSchema);
