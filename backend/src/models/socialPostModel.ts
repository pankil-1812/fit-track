import mongoose from 'mongoose';

export interface IComment {
  user: mongoose.Schema.Types.ObjectId;
  text: string;
  createdAt: Date;
  reactions: {
    like: mongoose.Schema.Types.ObjectId[];
  };
}

export interface ISocialPost extends mongoose.Document {
  user: mongoose.Schema.Types.ObjectId;
  content: string;
  mediaUrls: string[];
  workoutLog?: mongoose.Schema.Types.ObjectId;
  routine?: mongoose.Schema.Types.ObjectId;
  challenge?: mongoose.Schema.Types.ObjectId;
  tags: string[];
  reactions: {
    like: mongoose.Schema.Types.ObjectId[];
    celebrate: mongoose.Schema.Types.ObjectId[];
    support: mongoose.Schema.Types.ObjectId[];
  };
  comments: IComment[];
  visibility: string;
  location: {
    type: string;
    coordinates: number[];
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Comment must belong to a user']
    },
    text: {
      type: String,
      required: [true, 'Comment text is required']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    reactions: {
      like: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }
      ]
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const SocialPostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Post must belong to a user']
    },
    content: {
      type: String,
      required: [true, 'Post content cannot be empty']
    },
    mediaUrls: {
      type: [String],
      default: []
    },
    workoutLog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkoutLog'
    },
    routine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Routine'
    },
    challenge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge'
    },
    tags: {
      type: [String],
      default: []
    },
    reactions: {
      like: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }
      ],
      celebrate: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }
      ],
      support: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }
      ]
    },
    comments: [CommentSchema],
    visibility: {
      type: String,
      enum: ['public', 'friends', 'private'],
      default: 'public'
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
      },
      name: {
        type: String,
        default: ''
      }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create 2dsphere index for location
SocialPostSchema.index({ location: '2dsphere' });

// Virtuals for total reaction counts
SocialPostSchema.virtual('likeCount').get(function (this: ISocialPost) {
  return this.reactions.like.length;
});

SocialPostSchema.virtual('celebrateCount').get(function (this: ISocialPost) {
  return this.reactions.celebrate.length;
});

SocialPostSchema.virtual('supportCount').get(function (this: ISocialPost) {
  return this.reactions.support.length;
});

SocialPostSchema.virtual('commentCount').get(function (this: ISocialPost) {
  return this.comments.length;
});

// Populate all references
SocialPostSchema.pre(/^find/, function (this: mongoose.Query<any, any>, next) {
  this.populate({
    path: 'user',
    select: 'name profilePicture'
  })
  .populate({
    path: 'comments.user',
    select: 'name profilePicture'
  })
  .populate({
    path: 'workoutLog',
    select: 'title duration'
  })
  .populate({
    path: 'routine',
    select: 'title'
  })
  .populate({
    path: 'challenge',
    select: 'title'
  });
  next();
});

export const SocialPost = mongoose.model<ISocialPost>('SocialPost', SocialPostSchema);
