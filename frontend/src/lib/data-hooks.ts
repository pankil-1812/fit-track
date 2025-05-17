import { useEffect, useState } from "react";
// API services for Phase 3 integration
import { routineService, challengeService, socialService, workoutLogService } from "@/lib/api";
// Mock data (will be gradually replaced with API responses)
import { routines as mockRoutines, challenges as mockChallenges, socialPosts as mockSocialPosts } from "@/lib/mock-data";
import type { Routine, Exercise, WorkoutSession, CompletedExercise, Challenge, 
  ChallengeDay, SocialPost, Comment, WorkoutLog, LoggedExercise, UserChallenges, ApiStatus } from "@/lib/types";

// Re-export types for convenience
export type { Routine, Exercise, WorkoutSession, CompletedExercise, Challenge, 
  ChallengeDay, SocialPost, Comment, WorkoutLog, LoggedExercise, UserChallenges, ApiStatus };

// Constants for API status
export const API_STATUS: Record<string, ApiStatus> = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

/**
 * Hook for fetching all user routines
 */
export function useRoutines() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [status, setStatus] = useState<ApiStatus>(API_STATUS.IDLE);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRoutines = async () => {
      setStatus(API_STATUS.LOADING);
        try {
        // For Phase 3: Use the API service for production
        if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
          // Fallback to mock data if environment variable is set
          setRoutines(mockRoutines as Routine[]);
        } else {
          const data = await routineService.getAllRoutines();
          setRoutines(data);
        }
        setStatus(API_STATUS.SUCCESS);
      } catch (err) {
        console.error("Error fetching routines:", err);
        setStatus(API_STATUS.ERROR);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      }
    };

    fetchRoutines();
  }, []);

  return { routines, status, error };
}

/**
 * Hook for fetching a single routine by ID
 */
export function useRoutine(id: string | number) {
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [status, setStatus] = useState<ApiStatus>(API_STATUS.IDLE);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchRoutine = async () => {
      setStatus(API_STATUS.LOADING);
        try {
        // For Phase 3: Use the API service for production
        if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
          // Fallback to mock data if environment variable is set
          const foundRoutine = mockRoutines.find(r => r.id.toString() === id.toString());
          setRoutine(foundRoutine || null);
        } else {
          const data = await routineService.getRoutineById(id.toString());
          setRoutine(data);
        }
        setStatus(API_STATUS.SUCCESS);
      } catch (err) {
        console.error(`Error fetching routine with ID ${id}:`, err);
        setStatus(API_STATUS.ERROR);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      }
    };

    fetchRoutine();
  }, [id]);

  return { routine, status, error };
}

/**
 * Hook for fetching all challenges
 */
export function useChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [status, setStatus] = useState<ApiStatus>(API_STATUS.IDLE);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      setStatus(API_STATUS.LOADING);
        try {
        // For Phase 3: Use the API service for production
        if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
          // Fallback to mock data if environment variable is set
          setChallenges(mockChallenges as Challenge[]);
        } else {
          const data = await challengeService.getAllChallenges();
          setChallenges(data);
        }
        setStatus(API_STATUS.SUCCESS);
      } catch (err) {
        console.error("Error fetching challenges:", err);
        setStatus(API_STATUS.ERROR);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      }
    };

    fetchChallenges();
  }, []);

  return { challenges, status, error };
}

/**
 * Hook for fetching a single challenge by ID
 */
export function useChallenge(id: string | number) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [status, setStatus] = useState<ApiStatus>(API_STATUS.IDLE);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchChallenge = async () => {
      setStatus(API_STATUS.LOADING);
        try {
        // For Phase 3: Use the API service for production
        if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
          // Fallback to mock data if environment variable is set
          const foundChallenge = mockChallenges.find(c => c.id.toString() === id.toString());
          setChallenge(foundChallenge || null);
        } else {
          const data = await challengeService.getChallengeById(id.toString());
          setChallenge(data);
        }
        setStatus(API_STATUS.SUCCESS);
      } catch (err) {
        console.error(`Error fetching challenge with ID ${id}:`, err);
        setStatus(API_STATUS.ERROR);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      }
    };

    fetchChallenge();
  }, [id]);

  return { challenge, status, error };
}

/**
 * Hook for fetching user challenges
 */
export function useUserChallenges() {
  const [userChallenges, setUserChallenges] = useState<UserChallenges>({
    active: [],
    completed: [],
    past: []
  });
  const [status, setStatus] = useState<ApiStatus>(API_STATUS.IDLE);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserChallenges = async () => {
      setStatus(API_STATUS.LOADING);
      
      try {
        // For Phase 3: Use the API service for production
        if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
          // Fallback to mock data if environment variable is set
          setUserChallenges({
            active: mockChallenges.filter((_, i) => i % 2 === 0) as Challenge[],
            completed: mockChallenges.filter((_, i) => i === 1) as Challenge[],
            past: mockChallenges.filter((_, i) => i === 3) as Challenge[]
          });
        } else {
          const data = await challengeService.getUserChallenges();
          setUserChallenges({
            active: data.active || [],
            completed: data.completed || [],
            past: data.past || []
          });
        }
        setStatus(API_STATUS.SUCCESS);
      } catch (err) {
        console.error("Error fetching user challenges:", err);
        setStatus(API_STATUS.ERROR);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      }
    };

    fetchUserChallenges();
  }, []);

  return { userChallenges, status, error };
}

/**
 * Hook for fetching social feed posts
 */
export function useSocialFeed(page = 1, limit = 10) {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [status, setStatus] = useState<ApiStatus>(API_STATUS.IDLE);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setStatus(API_STATUS.LOADING);
        try {
        // For Phase 3: Use the API service for production
        if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
          // Fallback to mock data if environment variable is set
          setPosts(mockSocialPosts as SocialPost[]);
        } else {
          const data = await socialService.getUserFeed(page, limit);
          setPosts(data.posts || []);
        }
        setStatus(API_STATUS.SUCCESS);
      } catch (err) {
        console.error("Error fetching social feed:", err);
        setStatus(API_STATUS.ERROR);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      }
    };

    fetchPosts();
  }, [page, limit]);

  return { posts, status, error };
}

/**
 * Hook for fetching workout logs by date
 */
export function useWorkoutLogs(date: string) {
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [status, setStatus] = useState<ApiStatus>(API_STATUS.IDLE);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      setStatus(API_STATUS.LOADING);
        try {
        // For Phase 3: Use the API service for production
        if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
          // For Phase 2: Just set empty logs for mock data
          setLogs([]);
        } else {
          const data = await workoutLogService.getWorkoutLogsByDate(date);
          setLogs(data || []);
        }
        setStatus(API_STATUS.SUCCESS);
      } catch (err) {
        console.error("Error fetching workout logs:", err);
        setStatus(API_STATUS.ERROR);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      }
    };

    fetchLogs();
  }, [date]);

  return { logs, status, error };
}
