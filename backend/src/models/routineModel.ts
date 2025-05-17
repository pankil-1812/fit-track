import mongoose from 'mongoose';

export interface IExercise {
    name: string;
    description: string;
    sets: number;
    reps: number;
    duration: number; // in seconds
    restTime: number; // in seconds
    weight: number;
    notes: string;
    mediaUrl?: string;
}

export interface IRoutine {
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string;
    user: mongoose.Types.ObjectId;
    exercises: IExercise[];
    tags: string[];
    difficulty: string;
    estimatedDuration: number; // in minutes
    category: string;
    isPublic: boolean;
    isFeatured: boolean;
    likes: mongoose.Types.ObjectId[];
    saves: number;
    shared: boolean;
    createdAt: Date;
    updatedAt: Date;
    exerciseCount?: number; // Virtual property
}

// For use with mongoose model and document instances
export type RoutineDocument = mongoose.Document<unknown, {}, IRoutine> & IRoutine;

const ExerciseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide an exercise name'],
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    sets: {
        type: Number,
        default: 1
    },
    reps: {
        type: Number,
        default: 10
    },
    duration: {
        type: Number,
        default: 0
    },
    restTime: {
        type: Number,
        default: 60
    },
    weight: {
        type: Number,
        default: 0
    },
    notes: {
        type: String,
        default: ''
    },
    mediaUrl: {
        type: String
    }
});

const RoutineSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please provide a routine title'],
            trim: true,
            maxlength: [100, 'Title cannot be more than 100 characters']
        },
        description: {
            type: String,
            default: '',
            maxlength: [500, 'Description cannot be more than 500 characters']
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Routine must belong to a user']
        },
        exercises: [ExerciseSchema],
        tags: {
            type: [String],
            default: []
        },
        difficulty: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced', 'expert'],
            default: 'intermediate'
        },
        estimatedDuration: {
            type: Number,
            default: 0
        },
        category: {
            type: String,
            enum: [
                'strength',
                'cardio',
                'hiit',
                'flexibility',
                'bodyweight',
                'powerlifting',
                'crossfit',
                'yoga',
                'other'
            ],
            default: 'other'
        },
        isPublic: {
            type: Boolean,
            default: false
        },
        isFeatured: {
            type: Boolean,
            default: false
        },
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        saves: {
            type: Number,
            default: 0
        },
        shared: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Virtual property for total exercise count
RoutineSchema.virtual('exerciseCount').get(function (this: RoutineDocument) {
    return this.exercises.length;
});

// Ensure user ref is populated
RoutineSchema.pre(/^find/, function (this: mongoose.Query<any, any>, next) {
    this.populate({
        path: 'user',
        select: 'name profilePicture'
    });
    next();
});

// Calculate estimated duration
RoutineSchema.pre('save', function (next) {
    const routine = this as RoutineDocument;
    let totalDuration = 0;

    routine.exercises.forEach(exercise => {
        const exerciseDuration = (exercise.sets * (exercise.duration + exercise.restTime));
        totalDuration += exerciseDuration;
    });

    // Convert seconds to minutes
    routine.estimatedDuration = Math.ceil(totalDuration / 60);
    next();
});

export const Routine = mongoose.model<RoutineDocument>('Routine', RoutineSchema);