import axios from 'axios';
import { 
  User, 
  RegisterUserData, 
  LoginData, 
  UserProfileData, 
  UserSettings, 
  Routine,
  Challenge,
  CompletedExercise
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (token expired/invalid)
    if (error.response && error.response.status === 401) {
      // If we're in a browser environment
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        
        // Redirect to login page
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth service
export const authService = {
  login: async (credentials: { email: string, password: string }) => {
    const response = await api.post<{ token: string; user: User }>('/users/login', credentials);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  },

  register: async (userData: { name: string; email: string; password: string }) => {
    const response = await api.post<{ token: string; user: User }>('/users/register', userData);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  },

  logout: async () => {
    try {
      await api.get('/users/logout');
    } catch (error) {
      // ignore
    } finally {
      localStorage.removeItem('authToken');
    }
  },
  
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },
  
  isAuthenticated: (): boolean => {
    return localStorage.getItem('authToken') !== null;
  },
  
  forgotPassword: async (email: string) => {
    const response = await api.post<{ success: boolean; message: string }>('/users/forgot-password', { email });
    return response.data;
  },
  
  resetPassword: async (resetToken: string, password: string) => {
    const response = await api.post<{ success: boolean; message: string }>(`/users/reset-password/${resetToken}`, { password });
    return response.data;
  },
  
  refreshToken: async () => {
    const response = await api.post<{ token: string }>('/users/refresh-token');
    
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    
    return response.data;
  },
};

// User service
export const userService = {
  getUserProfile: async () => {
    const response = await api.get<{ success: boolean; data: User }>('/users/me');
    return { user: response.data.data };
  },
  
  updateUserProfile: async (userData: UserProfileData) => {
    const response = await api.put<{ success: boolean; data: User }>('/users/update-details', userData);
    return { user: response.data.data };
  },
  
  updateUserSettings: async (settings: UserSettings) => {
    const response = await api.put<{ success: boolean }>('/users/privacy', settings);
    return response.data;
  },
  
  uploadProfilePicture: async (formData: FormData) => {
    const response = await api.put<{ success: boolean; data: User }>(
      '/users/profile-picture',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return { user: response.data.data };
  },
  
  updatePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const response = await api.put<{ success: boolean; message?: string }>('/users/update-password', data);
    return response.data;
  },
};

// Routines service
export const routineService = {
    getAllRoutines: async () => {
        const response = await api.get<{
            success: boolean;
            count: number;
            total: number;
            pagination: { current: number; pages: number };
            data: Routine[];
        }>('/routines');
        return response.data;
    },

    getRoutineById: async (id: string) => {
        const response = await api.get<{
            success: boolean;
            data: Routine;
        }>(`/routines/${id}`);
        return response.data.data;
    },

    createRoutine: async (routineData: CreateRoutineData) => {
        // Ensure all required fields are present with proper formatting
        const payload = {
            title: routineData.title.trim(),
            description: routineData.description.trim(),
            category: routineData.category,
            difficulty: routineData.difficulty,
            isPublic: routineData.isPublic ?? false,
            tags: routineData.tags || [],
            exercises: routineData.exercises.map(exercise => ({
                name: exercise.name.trim(),
                description: exercise.description?.trim() || '',
                sets: Math.max(1, exercise.sets || 3),
                reps: Math.max(1, exercise.reps || 10),
                duration: Math.max(0, exercise.duration || 0),
                restTime: Math.max(0, exercise.restTime || 60),
                weight: Math.max(0, exercise.weight || 0),
                notes: exercise.notes?.trim() || '',
                mediaUrl: exercise.mediaUrl || ''
            }))
        };

        // Validate the payload matches our requirements
        if (!payload.title || !payload.description || !payload.category || !payload.difficulty) {
            throw new Error('Missing required fields');
        }

        if (!['beginner', 'intermediate', 'advanced'].includes(payload.difficulty)) {
            throw new Error('Invalid difficulty level');
        }

        if (payload.exercises.length === 0) {
            throw new Error('At least one exercise is required');
        }

        const response = await api.post<{
            success: boolean;
            data: Routine;
        }>('/routines', payload);
        return response.data.data;
    },

    updateRoutine: async (id: string, routineData: UpdateRoutineData) => {
        // Only include fields that are present in the update data
        const payload: Partial<CreateRoutineData> = {};

        if (routineData.title !== undefined) {
            payload.title = routineData.title.trim();
        }
        if (routineData.description !== undefined) {
            payload.description = routineData.description.trim();
        }
        if (routineData.category !== undefined) {
            payload.category = routineData.category;
        }
        if (routineData.difficulty !== undefined) {
            payload.difficulty = routineData.difficulty;
        }
        if (routineData.isPublic !== undefined) {
            payload.isPublic = routineData.isPublic;
        }
        if (routineData.tags !== undefined) {
            payload.tags = routineData.tags;
        }
        if (routineData.exercises !== undefined) {
            payload.exercises = routineData.exercises.map(exercise => ({
                name: exercise.name.trim(),
                description: exercise.description?.trim() || '',
                sets: Math.max(1, exercise.sets || 3),
                reps: Math.max(1, exercise.reps || 10),
                duration: Math.max(0, exercise.duration || 0),
                restTime: Math.max(0, exercise.restTime || 60),
                weight: Math.max(0, exercise.weight || 0),
                notes: exercise.notes?.trim() || '',
                mediaUrl: exercise.mediaUrl || ''
            }));
        }

        const response = await api.put<{
            success: boolean;
            data: Routine;
        }>(`/routines/${id}`, payload);
        return response.data.data;
    },

    deleteRoutine: async (id: string) => {
        const response = await api.delete<{
            success: boolean;
            data: Record<string, never>;
        }>(`/routines/${id}`);
        return response.data;
    },

    likeRoutine: async (id: string) => {
        const response = await api.put<{
            success: boolean;
            liked: boolean;
            likeCount: number;
            data: Routine;
        }>(`/routines/${id}/like`);
        return response.data;
    },

    saveRoutine: async (id: string) => {
        const response = await api.put<{
            success: boolean;
            saveCount: number;
            data: Routine;
        }>(`/routines/${id}/save`);
        return response.data;
    },

    searchRoutines: async (query: string) => {
        const response = await api.get<{
            success: boolean;
            count: number;
            data: Routine[];
        }>(`/routines/search?q=${query}`);
        return response.data;
    },
};

// Workout logs service
export const workoutLogService = {
  getAllWorkoutLogs: async () => {
    const response = await api.get<{
      success: boolean;
      data: WorkoutLog[];
    }>('/workout-logs');
    return response.data;
  },
  
  getWorkoutLogById: async (id: string) => {
    const response = await api.get<{
      success: boolean;
      data: WorkoutLog;
    }>(`/workout-logs/${id}`);
    return response.data;
  },
  
  getWorkoutLogsByDate: async (date: string) => {
    const response = await api.get<{
      success: boolean;
      data: WorkoutLog[];
    }>(`/workout-logs/date/${date}`);
    return response.data;
  },

  getWorkoutLogsByRoutine: async (routineId: string) => {
    const response = await api.get<{
      success: boolean;
      data: WorkoutLog[];
    }>(`/workout-logs/routine/${routineId}`);
    return response.data;
  },
  
  createWorkoutLog: async (logData: CreateWorkoutLogData) => {
    const response = await api.post<{
      success: boolean;
      data: WorkoutLog;
    }>('/workout-logs', logData);
    return response.data;
  },
  
  updateWorkoutLog: async (id: string, logData: UpdateWorkoutLogData) => {
    const response = await api.put<{
      success: boolean;
      data: WorkoutLog;
    }>(`/workout-logs/${id}`, logData);
    return response.data;
  },
  
  deleteWorkoutLog: async (id: string) => {
    const response = await api.delete<{
      success: boolean;
      data: Record<string, never>;
    }>(`/workout-logs/${id}`);
    return response.data;
  },

  getWorkoutStats: async () => {
    const response = await api.get<{
      success: boolean;
      data: {
        totalWorkouts: number;
        totalDuration: number;
        totalExercises: number;
        frequentRoutines: Array<{ routine: Routine; count: number }>;
      };
    }>('/workout-logs/stats');
    return response.data;
  }
};

// Analytics service
export const analyticsService = {
  getWorkoutSummary: async (timeframe: string) => {
    const response = await api.get(`/analytics/summary?timeframe=${timeframe}`);
    return response.data;
  },
  
  getPerformanceData: async (exerciseIds: string[], timeframe: string) => {
    const response = await api.get(`/analytics/performance`, {
      params: { 
        exercises: exerciseIds.join(','),
        timeframe 
      }
    });
    return response.data;
  },
  
  getMuscleGroupDistribution: async (timeframe: string) => {
    const response = await api.get(`/analytics/muscle-groups?timeframe=${timeframe}`);
    return response.data;
  },
  
  getWorkoutFrequency: async (timeframe: string) => {
    const response = await api.get(`/analytics/frequency?timeframe=${timeframe}`);
    return response.data;
  },
  
  getPersonalRecords: async () => {
    const response = await api.get('/analytics/personal-records');
    return response.data;
  },
};

// Challenge service
export const challengeService = {
  getAllChallenges: async () => {
    const response = await api.get('/challenges');
    return response.data;
  },
  
  getChallengeById: async (id: string) => {
    const response = await api.get(`/challenges/${id}`);
    return response.data;
  },
  
  joinChallenge: async (id: string) => {
    const response = await api.post(`/challenges/${id}/join`);
    return response.data;
  },
  
  leaveChallenge: async (id: string) => {
    const response = await api.post(`/challenges/${id}/leave`);
    return response.data;
  },
  
  getUserChallenges: async () => {
    const response = await api.get('/challenges/user');
    return response.data;
  },
};

// Social service
export const socialService = {
  getPosts: async (page = 1, limit = 10) => {
    const response = await api.get(`/social/posts?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  createPost: async (postData: any) => {
    const response = await api.post('/social/posts', postData);
    return response.data;
  },
  
  likePost: async (id: string) => {
    const response = await api.post(`/social/posts/${id}/like`);
    return response.data;
  },
  
  commentOnPost: async (id: string, comment: string) => {
    const response = await api.post(`/social/posts/${id}/comment`, { comment });
    return response.data;
  },
  
  getUserFeed: async (page = 1, limit = 10) => {
    const response = await api.get(`/social/feed?page=${page}&limit=${limit}`);
    return response.data;
  },
};

// Stretch sequence service
export const stretchService = {
  getAllStretchSequences: async () => {
    const response = await api.get('/stretch-sequences');
    return response.data;
  },
  
  getStretchSequenceById: async (id: string) => {
    const response = await api.get(`/stretch-sequences/${id}`);
    return response.data;
  },
  
  getStretchSequencesByTarget: async (targetArea: string) => {
    const response = await api.get(`/stretch-sequences/target/${targetArea}`);
    return response.data;
  },
};
