import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export interface IUser extends mongoose.Document {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    profilePicture: string;
    bio: string;
    height: number;
    weight: number;
    dateOfBirth: Date;
    gender: string;
    fitnessGoals: string[];
    injuries: string[];
    activityLevel: string;
    privacySettings: {
        profileVisibility: string;
        activityVisibility: string;
        showInLeaderboards: boolean;
    };
    role: string;
    twoFactorEnabled: boolean;
    twoFactorSecret?: string;
    refreshToken?: string;
    passwordChangedAt?: Date;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    matchPassword(enteredPassword: string): Promise<boolean>;
    getSignedJwtToken(): string;
    getRefreshToken(): string;
    changedPasswordAfter(JWTTimestamp: number): boolean;
    createPasswordResetToken(): string;
}

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
            trim: true,
            maxlength: [50, 'Name cannot be more than 50 characters']
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
        },
        password: {
            type: String,
            required: [true, 'Please add a password'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false
        },
        profilePicture: {
            type: String,
            default: 'default-profile.png'
        },
        bio: {
            type: String,
            maxlength: [500, 'Bio cannot be more than 500 characters'],
            default: ''
        },
        height: {
            type: Number,
            default: 0
        },
        weight: {
            type: Number,
            default: 0
        },
        dateOfBirth: {
            type: Date
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'non-binary', 'prefer-not-to-say', ''],
            default: ''
        },
        fitnessGoals: {
            type: [String],
            default: []
        },
        injuries: {
            type: [String],
            default: []
        },
        activityLevel: {
            type: String,
            enum: ['sedentary', 'light', 'moderate', 'active', 'very-active', ''],
            default: ''
        },
        privacySettings: {
            profileVisibility: {
                type: String,
                enum: ['public', 'friends', 'private'],
                default: 'public'
            },
            activityVisibility: {
                type: String,
                enum: ['public', 'friends', 'private'],
                default: 'public'
            },
            showInLeaderboards: {
                type: Boolean,
                default: true
            }
        },
        role: {
            type: String,
            enum: ['user', 'premium', 'admin'],
            default: 'user'
        },
        twoFactorEnabled: {
            type: Boolean,
            default: false
        },
        twoFactorSecret: {
            type: String,
            select: false
        },
        refreshToken: {
            type: String,
            select: false
        },
        passwordChangedAt: {
            type: Date,
            select: false
        },
        passwordResetToken: {
            type: String,
            select: false
        },
        passwordResetExpires: {
            type: Date,
            select: false
        },
        active: {
            type: Boolean,
            default: true,
            select: false
        },
        username: {
            type: String,
            unique: true,
            sparse: true,
            trim: true,
            maxlength: [30, 'Username cannot be more than 30 characters']
        },
        fitnessGoal: {
            type: String,
            default: ''
        },
        fitnessLevel: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced', ''],
            default: ''
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Virtual for age calculation
UserSchema.virtual('age').get(function (this: IUser) {
    if (!this.dateOfBirth) return null;

    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Set passwordChangedAt when password changes
UserSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) {
        next();
        return;
    }

    this.passwordChangedAt = new Date(Date.now() - 1000);
    next();
});

// Only find active users
UserSchema.pre(/^find/, function (this: mongoose.Query<any, any>, next) {
    this.find({ active: { $ne: false } });
    next();
});

// Match password method
UserSchema.methods.matchPassword = async function (
    enteredPassword: string
): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Check if password was changed after JWT was issued
UserSchema.methods.changedPasswordAfter = function (JWTTimestamp: number): boolean {
    if (this.passwordChangedAt) {
        const changedTimestamp = Math.floor(
            this.passwordChangedAt.getTime() / 1000
        );
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

// Generate password reset token
UserSchema.methods.createPasswordResetToken = function (): string {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    return resetToken;
};

export const User = mongoose.model<IUser>('User', UserSchema);
