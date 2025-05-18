import React, { useEffect, useState } from 'react';
import { Card, CardContent } from './card';
import { Button } from './button';
import { Play, Pause, SkipForward } from 'lucide-react';
import { ProgressCircle } from './progress-circle';
import { Exercise, CompletedExercise } from '@/lib/types';
import { formatTime } from '@/lib/utils';

interface WorkoutExerciseProps {
  exercise: Exercise;
  onComplete: (completed: CompletedExercise) => void;
  onSkip: () => void;
  showControls?: boolean;
}

export function WorkoutExercise({ 
  exercise,
  onComplete,
  onSkip,
  showControls = true
}: WorkoutExerciseProps) {
  const [isPaused, setIsPaused] = useState(true);
  const [currentSet, setCurrentSet] = useState(1);
  const [currentRep, setCurrentRep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(exercise.duration || 0);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [isResting, setIsResting] = useState(false);

  // Reset state when exercise changes
  useEffect(() => {
    setIsPaused(true);
    setCurrentSet(1);
    setCurrentRep(0);
    setTimeLeft(exercise.duration || 0);
    setRestTimeLeft(0);
    setIsResting(false);
  }, [exercise]);

  // Timer effect
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (isResting) {
        setRestTimeLeft(prev => {
          if (prev <= 1) {
            setIsResting(false);
            setCurrentSet(prev => {
              if (prev >= exercise.sets) {
                // Exercise complete
                setIsPaused(true);
                onComplete({
                  ...exercise,
                  completed: true,
                  actualSets: exercise.sets,
                  actualReps: exercise.reps,
                  notes: ""
                });
                return prev;
              }
              return prev + 1;
            });
            return exercise.restTime || 60;
          }
          return prev - 1;
        });
      } else if (exercise.duration) {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsResting(true);
            return exercise.duration || 0;
          }
          return prev - 1;
        });
      } else {
        setCurrentRep(prev => {
          if (prev >= exercise.reps) {
            setIsResting(true);
            setCurrentRep(0);
            return 0;
          }
          return prev + 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, isResting, exercise, onComplete]);

  const togglePause = () => setIsPaused(prev => !prev);

  const progress = isResting 
    ? ((exercise.restTime || 60) - restTimeLeft) / (exercise.restTime || 60) * 100
    : exercise.duration
      ? (exercise.duration - timeLeft) / exercise.duration * 100
      : (currentRep / exercise.reps) * 100;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-semibold">{exercise.name}</h3>
            {exercise.description && (
              <p className="text-muted-foreground mt-1">{exercise.description}</p>
            )}
          </div>

          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="text-sm font-medium text-muted-foreground">Set</div>
              <div className="text-2xl font-bold">{currentSet}/{exercise.sets}</div>
            </div>

            <ProgressCircle progress={progress} size={160} strokeWidth={12}>
              {isResting ? (
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Rest</div>
                  <div className="text-2xl font-bold">{formatTime(restTimeLeft)}</div>
                </div>
              ) : exercise.duration ? (
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Time</div>
                  <div className="text-2xl font-bold">{formatTime(timeLeft)}</div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Reps</div>
                  <div className="text-2xl font-bold">{currentRep}/{exercise.reps}</div>
                </div>
              )}
            </ProgressCircle>

            <div className="text-center">
              <div className="text-sm font-medium text-muted-foreground">Weight</div>
              <div className="text-2xl font-bold">{exercise.weight || 0}kg</div>
            </div>
          </div>

          {showControls && (
            <div className="flex gap-2">
              <Button
                size="lg"
                variant={isPaused ? "default" : "outline"}
                onClick={togglePause}
              >
                {isPaused ? (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Start
                  </>
                ) : (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={onSkip}
              >
                <SkipForward className="mr-2 h-4 w-4" />
                Skip
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
