// Types for FitTrack Pro Application
// Contains all TypeScript interfaces for data models used across the app

// Common types
export type ApiStatus = "idle" | "loading" | "success" | "error";

// User related types
export interface User {
  _id: string;
  name: string;
  email: string;
  username?: string;
  profilePicture?: string;
  bio?: string;
  height?: number;
  weight?: number;
  dateOfBirth?: string;
  gender?: string;
  fitnessGoal?: string;
  fitnessGoals?: string[];
  fitnessLevel?: string;
  injuries?: string[];
  activityLevel?: string;
  privacySettings?: {
    profileVisibility: string;
    activityVisibility: string;
    showInLeaderboards: boolean;
  };
  role?: string;
  twoFactorEnabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterUserData {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  fitnessGoal?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserProfileData {
  name?: string;
  email?: string;
  username?: string;
  profilePicture?: string;
  bio?: string;
  height?: number;
  weight?: number;
  dateOfBirth?: string;
  gender?: string;
  fitnessGoal?: string;
  fitnessGoals?: string[];
  fitnessLevel?: string;
  injuries?: string[];
  activityLevel?: string;
}

// Exercise and Routine types
export interface Exercise {
  name: string;
  description?: string;
  sets: number; // Required, minimum 1
  reps: number; // Required, minimum 1
  duration?: number; // Optional, in seconds, minimum 0
  restTime?: number; // Optional, in seconds, minimum 0, default 60
  weight?: number; // Optional, in kg/lbs, minimum 0
  notes?: string;
  mediaUrl?: string;
}

export interface CompletedExercise extends Exercise {
  completed: boolean;
  actualSets: number;
  actualReps: number;
  actualWeight?: number;
  notes?: string;
}

export type RoutineDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type RoutineCategory =
  | 'strength'
  | 'cardio'
  | 'hiit'
  | 'flexibility'
  | 'bodyweight'
  | 'powerlifting'
  | 'crossfit'
  | 'yoga'
  | 'other';

export interface Routine {
  _id: string;
  title: string; // Required, max 100 chars
  description: string; // Required, max 500 chars
  user: string | User;
  exercises: Exercise[]; // At least one exercise required
  tags: string[];
  difficulty: RoutineDifficulty;
  estimatedDuration: number; // in minutes, calculated from exercises
  category: RoutineCategory;
  isPublic: boolean;
  isFeatured: boolean;
  likes: string[];
  saves: number;
  shared: boolean;
  createdAt: string;
  updatedAt: string;
  exerciseCount?: number;
}

export interface CreateRoutineData {
  title: string; // Required, max 100 chars
  description: string; // Required, max 500 chars
  category: RoutineCategory; // Required
  difficulty: RoutineDifficulty; // Required
  isPublic?: boolean; // Optional, default false
  exercises: Exercise[]; // Required, at least one
  tags?: string[]; // Optional
}

export interface UpdateRoutineData extends Partial<Omit<CreateRoutineData, 'exercises'>> {
  _id: string;
  exercises?: Exercise[]; // Optional for updates
}

// Workout Log types
export interface WorkoutLog {
  _id: string;
  user: string | User;
  routine: string | Routine;
  startTime: string;
  endTime: string;
  duration: number;
  exercises: CompletedExercise[];
  notes?: string;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkoutLogData {
  routine: string;
  startTime: string;
  endTime: string;
  duration: number;
  exercises: CompletedExercise[];
  notes?: string;
  rating?: number;
}

export interface UpdateWorkoutLogData extends Partial<CreateWorkoutLogData> {
  _id: string;
}

export interface RoutineStats {
  totalWorkouts: number;
  totalDuration: number;
  averageDuration: number;
}

export interface RoutineWithHistory extends Routine {
  workoutHistory?: WorkoutLog[];
  stats?: RoutineStats;
}

// Challenge related types
export interface Challenge {
  id: number;
  name: string;
  description: string;
  duration: string;
  difficulty: string;
  participants: number;
  startDate: string;
  endDate: string;
  progress: number;
  days: ChallengeDay[];
  image?: string;
}

export interface ChallengeDay {
  day: number;
  target: string;
  completed: boolean;
}

// Social related types
export interface SocialPost {
  id: number;
  user: {
    id: number;
    name: string;
    username: string;
    avatar: string;
  };
  content: string;
  image?: string;
  likes: number;
  comments: Comment[];
  timestamp: string;
}

export interface Comment {
  id: number;
  user: {
    id: number;
    name: string;
    username: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
}

export interface UserChallenges {
  active: Challenge[];
  completed: Challenge[];
  past: Challenge[];
}
