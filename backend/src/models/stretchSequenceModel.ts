import mongoose from 'mongoose';

export interface IStretch {
    name: string;
    description: string;
    duration: number; // in seconds
    mediaUrl?: string;
    targetMuscles: string[];
    notes: string;
}

export interface IStretchSequence {
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string;
    user: mongoose.Types.ObjectId;
    stretches: IStretch[];
    tags: string[];
    difficulty: string;
    estimatedDuration: number; // in minutes
    targetArea: string[];
    isPublic: boolean;
    isFeatured: boolean;
    likes: mongoose.Types.ObjectId[];
    saves: number;
    createdAt: Date;
    updatedAt: Date;
    stretchCount?: number; // Virtual property
}

// For use with mongoose model and document instances
export type StretchSequenceDocument = mongoose.Document<unknown, {}, IStretchSequence> & IStretchSequence;

const StretchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a stretch name'],
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    duration: {
        type: Number,
        default: 30 // 30 seconds default hold time
    },
    mediaUrl: {
        type: String
    },
    targetMuscles: {
        type: [String],
        default: []
    },
    notes: {
        type: String,
        default: ''
    }
});

const StretchSequenceSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please provide a stretch sequence title'],
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
            required: [true, 'Stretch sequence must belong to a user']
        },
        stretches: [StretchSchema],
        tags: {
            type: [String],
            default: []
        },
        difficulty: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced'],
            default: 'beginner'
        },
        estimatedDuration: {
            type: Number,
            default: 0
        },
        targetArea: {
            type: [String],
            default: []
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
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Virtual property for stretch count
StretchSequenceSchema.virtual('stretchCount').get(function (this: StretchSequenceDocument) {
    return this.stretches.length;
});

// Ensure user ref is populated
StretchSequenceSchema.pre(/^find/, function (this: mongoose.Query<any, any>, next) {
    this.populate({
        path: 'user',
        select: 'name profilePicture'
    });
    next();
});

// Calculate estimated duration
StretchSequenceSchema.pre('save', function (next) {
    const sequence = this as StretchSequenceDocument;
    let totalDuration = 0;

    sequence.stretches.forEach(stretch => {
        totalDuration += stretch.duration;
    });

    // Convert seconds to minutes
    sequence.estimatedDuration = Math.ceil(totalDuration / 60);
    next();
});

export const StretchSequence = mongoose.model<StretchSequenceDocument>('StretchSequence', StretchSequenceSchema);