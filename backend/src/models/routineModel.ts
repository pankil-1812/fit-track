import mongoose from 'mongoose';

export interface IExercise {
    name: string;
    description?: string;
    sets: number;
    reps: number;
    duration?: number; // in seconds
    restTime?: number; // in seconds
    weight?: number;
    notes?: string;
    mediaUrl?: string;
}

export interface IRoutine {
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string;
    user: mongoose.Types.ObjectId;
    exercises: IExercise[];
    tags: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedDuration: number; // in minutes
    category: 'strength' | 'cardio' | 'hiit' | 'flexibility' | 'bodyweight' | 'powerlifting' | 'crossfit' | 'yoga' | 'other';
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
        type: String
    },
    sets: {
        type: Number,
        required: [true, 'Number of sets is required'],
        default: 3
    },
    reps: {
        type: Number,
        required: [true, 'Number of reps is required'],
        default: 10
    },
    duration: {
        type: Number
    },
    restTime: {
        type: Number
    },
    weight: {
        type: Number
    },
    notes: {
        type: String
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
            required: [true, 'Please provide a routine description'],
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
            enum: ['beginner', 'intermediate', 'advanced'],
            default: 'intermediate'
        },
        estimatedDuration: {
            type: Number,
            required: [true, 'Please provide an estimated duration'],
            min: [1, 'Duration must be at least 1 minute']
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
            required: [true, 'Please provide a category']
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

// Virtual property for exercise count
RoutineSchema.virtual('exerciseCount').get(function() {
    return this.exercises?.length || 0;
});

export const Routine = mongoose.model<RoutineDocument>('Routine', RoutineSchema);