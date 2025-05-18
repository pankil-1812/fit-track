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
  onSkipSet: (skipped: CompletedExercise) => void;
  showControls?: boolean;
  isPaused?: boolean;
  onTogglePause?: () => void;
}

export function WorkoutExercise({ 
  exercise,
  onComplete,
  onSkipSet,
  showControls = true,
  isPaused = true,
  onTogglePause
}: WorkoutExerciseProps) {
  const [currentSet, setCurrentSet] = useState(1);
  const [currentRep, setCurrentRep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(exercise.duration || 0);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [isResting, setIsResting] = useState(false);

  // Reset state when exercise changes
  useEffect(() => {
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
      setRestTimeLeft(prevRest => {
        if (isResting) {
          if (prevRest <= 1) {
            setIsResting(false);
            setCurrentSet(prevSet => {
              if (prevSet >= exercise.sets) {
                setTimeout(() => {
                  onComplete({
                    ...exercise,
                    completed: true,
                    actualSets: exercise.sets,
                    actualReps: exercise.reps,
                    actualWeight: exercise.weight || 0,
                    notes: ""
                  });
                }, 500);
                return prevSet;
              }
              setTimeLeft(exercise.duration || 0);
              setCurrentRep(0);
              return prevSet + 1;
            });
            return 0;
          }
          return prevRest - 1;
        }
        return prevRest;
      });
      setTimeLeft(prevTime => {
        if (!isResting && exercise.duration) {
          if (prevTime <= 1) {
            setIsResting(true);
            setRestTimeLeft(exercise.restTime || 60);
            return 0;
          }
          return prevTime - 1;
        }
        return prevTime;
      });
      setCurrentRep(prevRep => {
        if (!isResting && !exercise.duration) {
          if (prevRep >= exercise.reps - 1) {
            setIsResting(true);
            setRestTimeLeft(exercise.restTime || 60);
            return 0;
          }
          return prevRep + 1;
        }
        return prevRep;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, isResting, exercise, onComplete]);

  // Skip set handler
  const handleSkipSet = () => {
    // Mark current set as skipped
    onSkipSet({
      ...exercise,
      completed: false,
      actualSets: 1,
      actualReps: 0,
      actualWeight: 0,
      notes: "Skipped set"
    });
    // Move to next set
    setCurrentSet(prev => {
      if (prev >= exercise.sets) {
        // If last set, complete exercise
        setTimeout(() => {
          onComplete({
            ...exercise,
            completed: true,
            actualSets: exercise.sets,
            actualReps: exercise.reps,
            actualWeight: exercise.weight || 0,
            notes: ""
          });
        }, 500);
        return prev;
      }
      return prev + 1;
    });
    setCurrentRep(0);
    setIsResting(false);
    setTimeLeft(exercise.duration || 0);
    setRestTimeLeft(0);
  };

  const togglePause = () => {
    if (onTogglePause) {
      onTogglePause();
    }
  };

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
          </div>          {showControls && (
            <div className="flex gap-2">
              <Button
                size="lg"
                variant={isPaused ? "default" : "outline"}
                onClick={togglePause}
              >
                {isPaused ? (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    {isResting ? "Start Rest Timer" : "Start Exercise"}
                  </>
                ) : (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    {isResting ? "Pause Rest" : "Pause Exercise"}
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleSkipSet}
              >
                <SkipForward className="mr-2 h-4 w-4" />
                Skip Set
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
