import { useEffect, useState, useCallback } from "react";
import { routineService, workoutLogService, challengeService, socialService } from "@/lib/api";
import type {
  Routine,
  Exercise,
  WorkoutLog,
  CompletedExercise,
  ApiStatus,
  RoutineWithHistory, Challenge,
  UserChallenges,
  SocialPost,
} from "@/lib/types";
import { challenges as mockChallenges, socialPosts as mockSocialPosts } from "@/lib/mock-data";

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
        const data = await routineService.getAllRoutines();
        setRoutines(data.data);
        setStatus(API_STATUS.SUCCESS);
      } catch (err) {
        console.error("Error fetching routines:", err);
        setStatus(API_STATUS.ERROR);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      }
    };

    fetchRoutines();
  }, []);

  // Add mutate function to allow manual refresh
  const mutate = async () => {
    setStatus(API_STATUS.LOADING);
    try {
      const data = await routineService.getAllRoutines();
      setRoutines(data.data);
      setStatus(API_STATUS.SUCCESS);
    } catch (err) {
      console.error("Error fetching routines:", err);
      setStatus(API_STATUS.ERROR);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    }
  };

  return { routines, status, error, mutate };
}

/**
 * Hook for fetching a single routine by ID
 */
export function useRoutine(id: string) {
  const [routine, setRoutine] = useState<RoutineWithHistory | null>(null);
  const [status, setStatus] = useState<ApiStatus>(API_STATUS.IDLE);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRoutine = async () => {
      setStatus(API_STATUS.LOADING);
      try {
        const data = await routineService.getRoutine(id);
        setRoutine(data.data || data);
        setStatus(API_STATUS.SUCCESS);
      } catch (err) {
        console.error(`Error fetching routine with ID ${id}:`, err);
        setStatus(API_STATUS.ERROR);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      }
    };

    if (id) {
      fetchRoutine();
    }
  }, [id]);

  return { routine, status, error };
}

/**
 * Hook for fetching workout history for a routine
 */
export function useRoutineWorkoutHistory(routineId: string) {
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [status, setStatus] = useState<ApiStatus>(API_STATUS.IDLE);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchWorkoutHistory = async () => {
      setStatus(API_STATUS.LOADING);
      try {
        const data = await workoutLogService.getWorkoutLogsByRoutine(routineId);
        setWorkoutLogs(data.data);
        setStatus(API_STATUS.SUCCESS);
      } catch (err) {
        console.error("Error fetching workout history:", err);
        setStatus(API_STATUS.ERROR);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      }
    };

    if (routineId) {
      fetchWorkoutHistory();
    }
  }, [routineId]);

  return { workoutLogs, status, error };
}

/**
 * Hook for managing workout sessions
 */
export function useWorkoutSession(routine: Routine | null) {
  const [isActive, setIsActive] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<CompletedExercise[]>([]);
  const [startTime, setStartTime] = useState<string>('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [workoutCompleted, setWorkoutCompleted] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Reset state when routine changes
  useEffect(() => {
    setIsActive(false);
    setCurrentExerciseIndex(0);
    setCompletedExercises([]);
    setStartTime('');
    setElapsedTime(0);
    setIsPaused(false);
    setWorkoutCompleted(false);
    setError(null);
  }, [routine?._id]);

  // Timer for workout duration
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused]); const startWorkout = useCallback(() => {
    if (!routine) return;
    setIsActive(true);
    setStartTime(new Date().toISOString());
    setCurrentExerciseIndex(0);
    setCompletedExercises([]);
    setElapsedTime(0);
    // Start paused so user can prepare and explicitly start when ready
    setIsPaused(true);
    setWorkoutCompleted(false);
    setError(null);
  }, [routine]);

  const togglePause = useCallback(() => {
    if (workoutCompleted) return;
    setIsPaused(prev => !prev);
  }, [workoutCompleted]);

  const skipExercise = useCallback(() => {
    if (!routine || currentExerciseIndex >= routine.exercises.length - 1 || workoutCompleted) return;

    // Mark current exercise as skipped
    const currentExercise = routine.exercises[currentExerciseIndex];
    setCompletedExercises(prev => [...prev, {
      ...currentExercise,
      completed: false,
      actualSets: 0,
      actualReps: 0,
      actualWeight: 0,
      notes: "Skipped"
    }]);

    setCurrentExerciseIndex(prev => prev + 1);
    setIsPaused(true);
  }, [currentExerciseIndex, routine, workoutCompleted]);

  const completeExercise = useCallback((exercise: CompletedExercise) => {
    if (workoutCompleted) return;

    setCompletedExercises(prev => [...prev, {
      ...exercise,
      completed: true,
      actualSets: Math.max(1, exercise.actualSets),
      actualReps: Math.max(1, exercise.actualReps),
      actualWeight: exercise.actualWeight ? Math.max(0, exercise.actualWeight) : exercise.weight
    }]);

    if (routine && currentExerciseIndex < routine.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setIsPaused(true);
    }
  }, [currentExerciseIndex, routine, workoutCompleted]);
  const finishWorkout = useCallback(async () => {
    if (!routine || !isActive) return null;

    try {
      const endTime = new Date().toISOString();
      const remainingExercises = routine.exercises.slice(currentExerciseIndex);

      // Make sure we have valid completed exercises
      const validCompletedExercises = completedExercises.map(ex => ({
        name: ex.name,
        description: ex.description || "",
        sets: ex.sets,
        reps: ex.reps,
        duration: ex.duration || 0,
        restTime: ex.restTime || 60,
        weight: ex.weight || 0,
        completed: Boolean(ex.completed),
        actualSets: Math.max(0, ex.actualSets || 0),
        actualReps: Math.max(0, ex.actualReps || 0),
        actualWeight: ex.actualWeight || 0,
        notes: ex.notes || ""
      }));

      // Add remaining exercises as skipped
      const allExercises = [
        ...validCompletedExercises,
        ...remainingExercises.map(ex => ({
          name: ex.name,
          description: ex.description || "",
          sets: ex.sets,
          reps: ex.reps,
          duration: ex.duration || 0,
          restTime: ex.restTime || 60,
          weight: ex.weight || 0,
          completed: false,
          actualSets: 0,
          actualReps: 0,
          actualWeight: 0,
          notes: "Skipped"
        }))
      ];

      const workoutLog = {
        routine: routine._id,
        startTime,
        endTime,
        duration: elapsedTime,
        exercises: allExercises,
        notes: `Completed ${validCompletedExercises.filter(e => e.completed).length} of ${routine.exercises.length} exercises`,
        rating: 5  // Can be updated with user rating later
      };

      console.log('Saving workout log:', workoutLog);
      const result = await workoutLogService.createWorkoutLog(workoutLog);
      console.log('Workout log saved successfully:', result);

      setIsActive(false);
      setCurrentExerciseIndex(0);
      setCompletedExercises([]);
      setElapsedTime(0);
      setIsPaused(false);
      setWorkoutCompleted(true);
      setError(null);

      return result;
    } catch (err) {
      console.error("Error saving workout log:", err);
      setError(err instanceof Error ? err : new Error('Failed to save workout'));
      throw err;
    }
  }, [routine, isActive, currentExerciseIndex, startTime, elapsedTime, completedExercises]);

  return {
    isActive,
    isPaused,
    workoutCompleted,
    currentExerciseIndex,
    completedExercises,
    elapsedTime,
    error,
    startWorkout,
    togglePause,
    skipExercise,
    completeExercise,
    finishWorkout
  };
}

/**
 * Hook for syncing workout data
 */
export function useSyncWorkoutData() {
  // Local state for tracking sync status
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Load last sync time from local storage
    const storedSyncTime = localStorage.getItem('lastWorkoutSync');
    if (storedSyncTime) {
      setLastSyncTime(storedSyncTime);
    }
  }, []);

  // Function to sync workout data with server
  const syncWorkouts = useCallback(async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setError(null);

    try {
      // Get all routines to ensure we have latest data
      const routinesData = await routineService.getAllRoutines();
      const routines = routinesData.data;

      // Get all workout logs
      const logsData = await workoutLogService.getAllWorkoutLogs();
      let logs = logsData.data;

      // Sort logs by date
      logs = logs.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

      // Store sync time
      const syncTime = new Date().toISOString();
      localStorage.setItem('lastWorkoutSync', syncTime);
      setLastSyncTime(syncTime);

      return {
        routines,
        logs,
        syncTime
      };
    } catch (err) {
      console.error('Error syncing workout data:', err);
      setError(err instanceof Error ? err : new Error('Sync failed'));
      throw err;
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing]);

  return {
    isSyncing,
    lastSyncTime,
    error,
    syncWorkouts
  };
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


export type { Routine, Exercise, WorkoutLog, CompletedExercise };
