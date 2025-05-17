import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
        localStorage.removeItem('user');
        
        // Redirect to login page
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth service
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },
  
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },
  
  isAuthenticated: () => {
    return localStorage.getItem('authToken') !== null;
  },
  
  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },
  
  resetPassword: async (token: string, password: string) => {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  },
};

// User service
export const userService = {
  getUserProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  
  updateUserProfile: async (userData: any) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },
  
  updateUserSettings: async (settings: any) => {
    const response = await api.put('/users/settings', settings);
    return response.data;
  },
};

// Routines service
export const routineService = {
  getAllRoutines: async () => {
    const response = await api.get('/routines');
    return response.data;
  },
  
  getRoutineById: async (id: string) => {
    const response = await api.get(`/routines/${id}`);
    return response.data;
  },
  
  createRoutine: async (routineData: any) => {
    const response = await api.post('/routines', routineData);
    return response.data;
  },
  
  updateRoutine: async (id: string, routineData: any) => {
    const response = await api.put(`/routines/${id}`, routineData);
    return response.data;
  },
  
  deleteRoutine: async (id: string) => {
    const response = await api.delete(`/routines/${id}`);
    return response.data;
  },
};

// Workout logs service
export const workoutLogService = {
  getAllWorkoutLogs: async () => {
    const response = await api.get('/workout-logs');
    return response.data;
  },
  
  getWorkoutLogById: async (id: string) => {
    const response = await api.get(`/workout-logs/${id}`);
    return response.data;
  },
  
  getWorkoutLogsByDate: async (date: string) => {
    const response = await api.get(`/workout-logs/date/${date}`);
    return response.data;
  },
  
  createWorkoutLog: async (logData: any) => {
    const response = await api.post('/workout-logs', logData);
    return response.data;
  },
  
  updateWorkoutLog: async (id: string, logData: any) => {
    const response = await api.put(`/workout-logs/${id}`, logData);
    return response.data;
  },
  
  deleteWorkoutLog: async (id: string) => {
    const response = await api.delete(`/workout-logs/${id}`);
    return response.data;
  },
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
