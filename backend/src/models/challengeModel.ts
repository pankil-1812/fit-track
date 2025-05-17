import mongoose from 'mongoose';

export interface IParticipant {
    user: mongoose.Types.ObjectId;
    progress: number;
    status: string;
    joinedAt: Date;
    completedAt?: Date;
}

export interface IChallenge {
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string;
    creator: mongoose.Types.ObjectId;
    type: string;
    goal: {
        type: string;
        value: number;
        unit: string;
    };
    startDate: Date;
    endDate: Date;
    participants: IParticipant[];
    rewards: {
        badge: string;
        points: number;
    };
    rules: string[];
    isPublic: boolean;
    isActive: boolean;
    category: string;
    leaderboard: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
    participantCount?: number; // Virtual property
    active?: boolean; // Virtual property
}

// For use with mongoose model and document instances
export type ChallengeDocument = mongoose.Document<unknown, {}, IChallenge> & IChallenge;

const ParticipantSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    progress: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['joined', 'in-progress', 'completed', 'dropped'],
        default: 'joined'
    },
    joinedAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date
    }
});

const ChallengeSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please provide a challenge title'],
            trim: true
        },
        description: {
            type: String,
            required: [true, 'Please provide a challenge description']
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Challenge must have a creator']
        },
        type: {
            type: String,
            enum: ['workout-count', 'distance', 'duration', 'calorie', 'strength', 'custom'],
            required: [true, 'Please specify challenge type']
        },
        goal: {
            type: {
                type: String,
                enum: ['count', 'distance', 'time', 'weight'],
                required: [true, 'Please specify goal type']
            },
            value: {
                type: Number,
                required: [true, 'Please specify goal value']
            },
            unit: {
                type: String,
                required: [true, 'Please specify goal unit']
            }
        },
        startDate: {
            type: Date,
            required: [true, 'Please specify challenge start date']
        },
        endDate: {
            type: Date,
            required: [true, 'Please specify challenge end date']
        },
        participants: [ParticipantSchema],
        rewards: {
            badge: {
                type: String,
                default: ''
            },
            points: {
                type: Number,
                default: 0
            }
        },
        rules: {
            type: [String],
            default: []
        },
        isPublic: {
            type: Boolean,
            default: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
        category: {
            type: String,
            enum: ['strength', 'cardio', 'flexibility', 'mindfulness', 'nutrition', 'general'],
            default: 'general'
        },
        leaderboard: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Virtual property for participant count
ChallengeSchema.virtual('participantCount').get(function (this: ChallengeDocument) {
    return this.participants.length;
});

// Virtual property to check if challenge is active
ChallengeSchema.virtual('active').get(function (this: ChallengeDocument) {
    const now = new Date();
    return now >= this.startDate && now <= this.endDate && this.isActive;
});

// Populate creator reference
ChallengeSchema.pre(/^find/, function (this: mongoose.Query<any, any>, next) {
    this.populate({
        path: 'creator',
        select: 'name profilePicture'
    });
    next();
});

// Update challenge status before save
ChallengeSchema.pre('save', function (next) {
    const challenge = this as ChallengeDocument;
    const now = new Date();

    if (now > challenge.endDate) {
        challenge.isActive = false;
    }

    next();
});

export const Challenge = mongoose.model<ChallengeDocument>('Challenge', ChallengeSchema);