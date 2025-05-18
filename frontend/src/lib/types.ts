// Types for FitTrack Pro Application
// Contains all TypeScript interfaces for data models used across the app

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

export interface UserSettings {
  profileVisibility: 'public' | 'friends' | 'private';
  activityVisibility: 'public' | 'friends' | 'private';
  showInLeaderboards: boolean;
  notificationsEmail?: boolean;
  notificationsPush?: boolean;
}

// Routine related types
export interface Routine {
  id: number;
  name: string;
  description: string;
  frequency: string;
  duration: string;
  level: string;
  category: string;
  exercises: Exercise[];
  history?: WorkoutSession[];
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
}

export interface WorkoutSession {
  date: string;
  duration: string;
  exercises: CompletedExercise[];
}

export interface CompletedExercise {
  name: string;
  completed: boolean;
  weight?: string;
  actualSets: number;
  actualReps: string;
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

// Workout log related types
export interface WorkoutLog {
  id: number;
  date: string;
  routineId: number;
  routineName: string;
  duration: string;
  exercises: LoggedExercise[];
  notes?: string;
}

export interface LoggedExercise {
  name: string;
  sets: number;
  reps: string;
  weight?: string;
  completed: boolean;
}

export interface UserChallenges {
  active: Challenge[];
  completed: Challenge[];
  past: Challenge[];
}

// API status type
export type ApiStatus = "idle" | "loading" | "success" | "error";
