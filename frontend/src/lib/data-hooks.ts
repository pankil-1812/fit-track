import { useEffect, useState, useCallback } from "react";
import { routineService, workoutLogService } from "@/lib/api";
import type { 
  Routine, 
  Exercise, 
  WorkoutLog, 
  CompletedExercise,
  ApiStatus 
} from "@/lib/types";

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

  return { routines, status, error };
}

/**
 * Hook for fetching a single routine by ID
 */
export function useRoutine(id: string) {
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [status, setStatus] = useState<ApiStatus>(API_STATUS.IDLE);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRoutine = async () => {
      setStatus(API_STATUS.LOADING);
      try {
        const data = await routineService.getRoutineById(id);
        setRoutine(data);
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
  const [isPaused, setIsPaused] = useState(true);
  
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
  }, [isActive, isPaused]);

  const startWorkout = useCallback(() => {
    setIsActive(true);
    setStartTime(new Date().toISOString());
    setCurrentExerciseIndex(0);
    setCompletedExercises([]);
    setElapsedTime(0);
    setIsPaused(true);
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  const skipExercise = useCallback(() => {
    if (!routine || currentExerciseIndex >= routine.exercises.length - 1) return;
    
    // Mark current exercise as skipped
    const currentExercise = routine.exercises[currentExerciseIndex];
    setCompletedExercises(prev => [...prev, {
      ...currentExercise,
      completed: false,
      actualSets: 0,
      actualReps: 0,
      notes: "Skipped"
    }]);
    
    setCurrentExerciseIndex(prev => prev + 1);
  }, [currentExerciseIndex, routine]);

  const completeExercise = useCallback((exercise: CompletedExercise) => {
    setCompletedExercises(prev => [...prev, exercise]);
    
    if (routine && currentExerciseIndex < routine.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setIsPaused(true);
    }
  }, [currentExerciseIndex, routine]);

  const finishWorkout = useCallback(async () => {
    if (!routine) return null;
    
    try {
      const endTime = new Date().toISOString();
      const workoutLog = {
        routine: routine._id,
        startTime,
        endTime,
        duration: elapsedTime,
        exercises: completedExercises,
      };

      const result = await workoutLogService.createWorkoutLog(workoutLog);
      
      setIsActive(false);
      setCurrentExerciseIndex(0);
      setCompletedExercises([]);
      setElapsedTime(0);
      setIsPaused(true);

      return result;
    } catch (err) {
      console.error("Error saving workout log:", err);
      throw err;
    }
  }, [routine, startTime, elapsedTime, completedExercises]);

  return {
    isActive,
    isPaused,
    currentExerciseIndex,
    completedExercises,
    elapsedTime,
    startWorkout,
    togglePause,
    skipExercise,
    completeExercise,
    finishWorkout
  };
}

export type { Routine, Exercise, WorkoutLog, CompletedExercise };
