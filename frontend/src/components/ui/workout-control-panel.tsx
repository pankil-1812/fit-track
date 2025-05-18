import React, { useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Info, Timer } from 'lucide-react';
import { formatTime } from '@/lib/utils';
import { WorkoutExercise } from './workout-exercise';
import type { Exercise, CompletedExercise } from '@/lib/types';

interface WorkoutControlPanelProps {
  currentExercise: Exercise;
  currentExerciseIndex: number;
  totalExercises: number;
  elapsedTime: number;
  completedExercises: CompletedExercise[];
  isPaused: boolean;
  isLastExercise: boolean;
  onComplete: (exercise: CompletedExercise) => void;
  onSkip: () => void;
  onTogglePause: () => void;
  onFinish: () => void;
}

export function WorkoutControlPanel({
  currentExercise,
  currentExerciseIndex,
  totalExercises,
  elapsedTime,
  completedExercises,
  isPaused,
  isLastExercise,
  onComplete,
  onSkip,
  onTogglePause,
  onFinish
}: WorkoutControlPanelProps) {
  const handleComplete = useCallback((exercise: CompletedExercise) => {
    onComplete(exercise);
  }, [onComplete]);

  return (
    <div className="space-y-4">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Workout in Progress</CardTitle>
          <CardDescription>
            Exercise {currentExerciseIndex + 1} of {totalExercises}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4" />
              <span className="text-lg font-medium">
                {formatTime(elapsedTime)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span>
                {completedExercises.length} of {totalExercises} completed
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Exercise */}
      <WorkoutExercise
        key={currentExerciseIndex}
        exercise={currentExercise}
        onComplete={handleComplete}
        onSkip={onSkip}
        showControls={!isPaused}
        isActive={!isPaused}
      />

      {/* Control Buttons */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Button
              className="flex-1"
              size="lg"
              onClick={onTogglePause}
            >
              {isPaused ? "Resume Workout" : "Pause Workout"}
            </Button>

            {isLastExercise && (
              <Button
                className="flex-1"
                size="lg"
                variant="default"
                onClick={onFinish}
              >
                Finish Workout
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
