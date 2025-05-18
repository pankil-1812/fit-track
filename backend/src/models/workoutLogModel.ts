import mongoose from 'mongoose';
import { IExercise } from './routineModel';

export interface ICompletedExercise extends IExercise {
    completed: boolean;
    actualSets: number;
    actualReps: number;
    actualWeight?: number;
    notes?: string;
}

export interface IWorkoutLog {
    _id: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    routine: mongoose.Types.ObjectId;
    startTime: Date;
    endTime: Date;
    duration: number; // in seconds
    exercises: ICompletedExercise[];
    notes?: string;
    rating?: number;
    createdAt: Date;
    updatedAt: Date;
}

const CompletedExerciseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Exercise name is required']
    },
    description: String,
    sets: {
        type: Number,
        required: [true, 'Number of sets is required']
    },
    reps: {
        type: Number,
        required: [true, 'Number of reps is required']
    },
    duration: Number,
    restTime: Number,
    weight: Number,
    completed: {
        type: Boolean,
        default: false
    },
    actualSets: {
        type: Number,
        required: [true, 'Actual sets completed is required']
    },
    actualReps: {
        type: Number,
        required: [true, 'Actual reps completed is required']
    },
    actualWeight: Number,
    notes: String
});

const WorkoutLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    },
    routine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Routine',
        required: [true, 'Routine is required']
    },
    startTime: {
        type: Date,
        required: [true, 'Start time is required']
    },
    endTime: {
        type: Date,
        required: [true, 'End time is required']
    },
    duration: {
        type: Number,
        required: [true, 'Duration is required']
    },
    exercises: [CompletedExerciseSchema],
    notes: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better query performance
WorkoutLogSchema.index({ user: 1, startTime: -1 });
WorkoutLogSchema.index({ routine: 1, startTime: -1 });

// Virtual for calculating progress
WorkoutLogSchema.virtual('progress').get(function() {
    if (!this.exercises.length) return 0;
    const completed = this.exercises.filter(ex => ex.completed).length;
    return Math.round((completed / this.exercises.length) * 100);
});

// Virtual for workout duration in minutes
WorkoutLogSchema.virtual('durationMinutes').get(function() {
    return Math.round(this.duration / 60);
});

export const WorkoutLog = mongoose.model<IWorkoutLog>('WorkoutLog', WorkoutLogSchema);
