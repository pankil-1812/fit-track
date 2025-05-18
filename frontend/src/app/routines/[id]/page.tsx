"use client"

import React from "react"
import {
  ArrowLeft,
  Clock,
  Edit,
  PlayCircle,
  Share2,
  Star,
  ChevronDown,
  Dumbbell,
  Timer,
  AlertCircle,
  Trash2,
  Check,
  X,
  Info,
  Pause,
  SkipForward,
  Plus
} from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { routineService } from "@/lib/api"
import { formatTime } from "@/lib/utils"
import { useRoutine, useRoutineWorkoutHistory, useWorkoutSession } from "@/lib/data-hooks"
import type { Exercise, CompletedExercise, RoutineCategory, RoutineDifficulty } from "@/lib/types"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { WorkoutExercise } from "@/components/ui/workout-exercise"

type Params = Promise<{ id: string }>

export default function RoutineDetailPage(props: { params: Params }) {
  const params = React.use(props.params);
  const routineId = params.id;
  const { routine, status } = useRoutine(routineId)
  const { workoutLogs } = useRoutineWorkoutHistory(routineId)
  const {
    isActive: workoutInProgress,
    isPaused,
    currentExerciseIndex,
    completedExercises,
    elapsedTime,
    startWorkout,
    togglePause,
    skipExercise,
    completeExercise,
    finishWorkout
  } = useWorkoutSession(routine)

  const { toast } = useToast()

  // UI State
  const [isStarred, setIsStarred] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showExerciseModal, setShowExerciseModal] = useState(false)
  const [editingExerciseIndex, setEditingExerciseIndex] = useState<number | null>(null)
  const [showEditRoutineModal, setShowEditRoutineModal] = useState(false)

  // Form State
  const [exerciseForm, setExerciseForm] = useState<Exercise>({
    name: "",
    description: "",
    sets: 3,
    reps: 10,
    duration: 0,
    restTime: 60,
    weight: 0,
    notes: ""
  })

  const [routineForm, setRoutineForm] = useState({
    title: routine?.title || "",
    description: routine?.description || "",
    category: routine?.category || "strength",
    difficulty: routine?.difficulty || "beginner",
    isPublic: routine?.isPublic || false
  })

  // Sync forms with routine data
  useEffect(() => {
    if (routine) {
      setRoutineForm({
        title: routine.title || "",
        description: routine.description || "",
        category: routine.category || "strength",
        difficulty: routine.difficulty || "beginner",
        isPublic: routine.isPublic || false
      })
    }
  }, [routine])

  // Handle exercise actions
  const handleSaveExercise = () => {
    if (!routine) {
      toast({
        title: "Error",
        description: "Routine not found",

      });
      return;
    }

    // Validate exercise form
    if (!exerciseForm.name) {
      toast({
        title: "Error",
        description: "Exercise name is required",

      });
      return;
    }

    const exercises = [...routine.exercises];
    if (editingExerciseIndex !== null) {
      exercises[editingExerciseIndex] = exerciseForm;
    } else {
      exercises.push(exerciseForm);
    }

    // Update routine with new exercises
    routineService.updateRoutine(routineId, {
      _id: routineId,
      title: routine.title,
      description: routine.description,
      category: routine.category,
      difficulty: routine.difficulty,
      isPublic: routine.isPublic,
      exercises
    })
      .then(() => {
        toast({
          title: "Success",
          description: editingExerciseIndex !== null ? "Exercise updated" : "Exercise added"
        });

        // Refresh routine data to update the UI
        return routineService.getRoutine(routineId);
      })
      .then(() => {
        // Force refresh by reloading the page
        window.location.reload();

        setShowExerciseModal(false);
        setEditingExerciseIndex(null);
        setExerciseForm({
          name: "",
          description: "",
          sets: 3,
          reps: 10,
          duration: 0,
          restTime: 60,
          weight: 0,
          notes: ""
        });
      })
      .catch((error) => {
        console.error("Error saving exercise:", error);
        toast({
          title: "Error",
          description: "Failed to save exercise",

        });
      });
  };

  // Handle workout actions
  const handleStartWorkout = () => {
    startWorkout();
    toast({
      title: "Workout started",
      description: "Your workout session has begun!"
    });
  };

  const handleSkipExercise = () => {
    skipExercise();
  };

  const handleCompleteExercise = (completedExercise: CompletedExercise) => {
    completeExercise(completedExercise);
    toast({
      title: "Exercise completed",
      description: "Moving to the next exercise"
    });
  };

  const handleFinishWorkout = () => {
    finishWorkout()
      .then((result) => {
        if (result) {
          toast({
            title: "Workout completed",
            description: "Great job! Your progress has been saved."
          });

          // Refresh routine data to update the history
          return routineService.getRoutine(routineId);
        }
        return null;
      })
      .then((updatedRoutineData) => {
        if (updatedRoutineData && updatedRoutineData.data) {
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error("Error finishing workout:", error);
        toast({
          title: "Error",
          description: "Failed to save workout progress. Please try again.",

        });
      });
  };

  const handleDeleteExercise = (index: number) => {
    if (!routine) return;
    const exercises = [...routine.exercises];
    exercises.splice(index, 1);

    routineService.updateRoutine(routineId, {
      _id: routineId,
      exercises
    })
      .then(() => {
        toast({
          title: "Exercise deleted",
          description: "The exercise has been removed from this routine"
        });
        // Refresh the page to show updated exercises
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error deleting exercise:", error);
        toast({
          title: "Error",
          description: "Failed to delete exercise",

        });
      });
  };

  const handleSaveRoutine = () => {
    if (!routine) return;

    // Always send exercises when updating
    routineService.updateRoutine(routineId, {
      _id: routineId,
      ...routineForm,
      exercises: routine.exercises
    })
      .then(() => {
        toast({
          title: "Success",
          description: "Your routine has been updated successfully"
        });
        setShowEditRoutineModal(false);
        // Refresh the page to show updated routine
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error updating routine:", error);
        toast({
          title: "Error",
          description: "Failed to update routine",

        });
      });
  };

  const handleDeleteRoutine = () => {
    setIsDeleting(true);

    routineService.deleteRoutine(routineId)
      .then(() => {
        window.location.href = "/routines";
      })
      .catch((error) => {
        console.error("Error deleting routine:", error);
        toast({
          title: "Error",
          description: "Failed to delete routine",

        });
      })
      .finally(() => {
        setIsDeleting(false);
        setShowDeleteDialog(false);
      });
  };

  // Add handleSkipSet function
  const handleSkipSet = (skippedSet: CompletedExercise) => {
    // Add skipped set to completedExercises
    completeExercise(skippedSet);
    toast({
      title: "Set skipped",
      description: "This set was marked as skipped."
    });
  };

  // Error and loading handling
  if (status === "loading" || status === "idle") {
    return <div className="flex flex-col items-center justify-center min-h-[40vh] text-lg">Loading routine...</div>;
  }
  if (!routine || status === "error") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <AlertCircle className="h-10 w-10 text-destructive mb-2" />
        <h2 className="text-xl font-bold mb-2">Routine not found</h2>
        <p className="text-muted-foreground mb-4">This routine might have been deleted or you don&apos;t have access to it.</p>
        <Link href="/routines" className="text-primary underline">Back to Routines</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/routines">
              <ArrowLeft className="h-6 w-6" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{routine.title}</h1>
            <p className="text-muted-foreground">{routine.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsStarred(!isStarred)}
          >
            <Star className={isStarred ? "fill-yellow-400" : ""} />
          </Button>
          <Button
            variant="outline"
            size="icon"
          >
            <Share2 />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowEditRoutineModal(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Routine
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Routine
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Workout Controls */}
          {!workoutInProgress ? (
            <Card>
              <CardHeader>
                <CardTitle>Ready to workout?</CardTitle>
                <CardDescription>Start this routine to track your progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{routine.estimatedDuration} minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Dumbbell className="h-4 w-4" />
                    <span>{routine.exercises.length} exercises</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleStartWorkout}>
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Start Workout
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Progress Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Workout in Progress</CardTitle>
                  <CardDescription>
                    Exercise {currentExerciseIndex + 1} of {routine.exercises.length}
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
                        {completedExercises.length} of {routine.exercises.length} completed
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>              {/* Current Exercise */}
              {routine.exercises[currentExerciseIndex] && (
                <WorkoutExercise
                  key={currentExerciseIndex}
                  exercise={routine.exercises[currentExerciseIndex]}
                  onComplete={handleCompleteExercise}
                  onSkipSet={handleSkipSet}
                  showControls={true}
                  isPaused={isPaused}
                  onTogglePause={togglePause}
                />
              )}

              {/* Control Buttons */}
              <div className="flex gap-4">              <Button
                className="flex-1"
                size="lg"
                variant={isPaused ? "default" : "outline"}
                onClick={togglePause}
              >
                {isPaused ? (
                  <>
                    <PlayCircle className="mr-2 h-5 w-5" />
                    {completedExercises.length > 0 ? "Continue Workout" : "Start Exercise"}
                  </>
                ) : (
                  <>
                    <Pause className="mr-2 h-5 w-5" />
                    Pause Workout
                  </>
                )}
              </Button>

                <Button
                  className="flex-1"
                  size="lg"
                  variant="outline"
                  onClick={handleSkipExercise}
                >
                  <SkipForward className="mr-2 h-5 w-5" />
                  Skip Exercise
                </Button>

                {currentExerciseIndex === routine.exercises.length - 1 && (
                  <Button
                    className="flex-1"
                    size="lg"
                    onClick={handleFinishWorkout}
                  >
                    Finish Workout
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Exercises List */}
          <Card>            <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Exercises</CardTitle>
                <CardDescription>
                  {routine.exercises.length} exercise{routine.exercises.length !== 1 ? 's' : ''}
                </CardDescription>
              </div>
              <Button
                onClick={() => {
                  setExerciseForm({
                    name: "",
                    description: "",
                    sets: 3,
                    reps: 10,
                    duration: 0,
                    restTime: 60,
                    weight: 0,
                    notes: ""
                  });
                  setEditingExerciseIndex(null);
                  setShowExerciseModal(true);
                }}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Exercise
              </Button>
            </div>
          </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {routine.exercises.map((exercise, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{exercise.name}</CardTitle>
                          <CardDescription>{exercise.description}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setExerciseForm(exercise);
                              setEditingExerciseIndex(index);
                              setShowExerciseModal(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteExercise(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <div>
                          {exercise.sets} sets × {exercise.reps} reps
                        </div>
                        {(exercise.weight ?? 0) > 0 && (
                          <div>{exercise.weight}kg</div>
                        )}
                        {(exercise.duration ?? 0) > 0 && (
                          <div>{formatTime(exercise.duration)}</div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workout History</CardTitle>
              <CardDescription>
                {workoutLogs.length} workout{workoutLogs.length !== 1 ? 's' : ''} completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workoutLogs.map((log) => (
                  <Card key={log._id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>
                            {format(new Date(log.startTime), 'MMMM d, yyyy')}
                          </CardTitle>
                          <CardDescription>
                            {format(new Date(log.startTime), 'h:mm a')} - {format(new Date(log.endTime), 'h:mm a')}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {Math.floor(log.duration / 60)} minutes
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {log.exercises.length} exercises
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {log.exercises.map((exercise, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-sm"
                          >
                            {exercise.completed ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <X className="h-4 w-4 text-red-500" />
                            )}
                            <span>
                              {exercise.name} - {exercise.actualSets} × {exercise.actualReps}
                              {exercise.actualWeight ? ` @ ${exercise.actualWeight}kg` : ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Exercise Modal */}
      <Dialog open={showExerciseModal} onOpenChange={setShowExerciseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingExerciseIndex !== null ? 'Edit Exercise' : 'Add Exercise'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Exercise name"
                value={exerciseForm.name}
                onChange={(e) => setExerciseForm((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Exercise description"
                value={exerciseForm.description}
                onChange={(e) =>
                  setExerciseForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="sets">Sets</Label>
                <Input
                  id="sets"
                  type="number"
                  min={1}
                  value={exerciseForm.sets}
                  onChange={(e) =>
                    setExerciseForm((prev) => ({
                      ...prev,
                      sets: parseInt(e.target.value) || 1,
                    }))
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="reps">Reps</Label>
                <Input
                  id="reps"
                  type="number"
                  min={1}
                  value={exerciseForm.reps}
                  onChange={(e) =>
                    setExerciseForm((prev) => ({
                      ...prev,
                      reps: parseInt(e.target.value) || 1,
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration (seconds)</Label>
                <Input
                  id="duration"
                  type="number"
                  min={0}
                  value={exerciseForm.duration}
                  onChange={(e) =>
                    setExerciseForm((prev) => ({
                      ...prev,
                      duration: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="restTime">Rest Time (seconds)</Label>
                <Input
                  id="restTime"
                  type="number"
                  min={0}
                  value={exerciseForm.restTime}
                  onChange={(e) =>
                    setExerciseForm((prev) => ({
                      ...prev,
                      restTime: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                min={0}
                step={0.5}
                value={exerciseForm.weight}
                onChange={(e) =>
                  setExerciseForm((prev) => ({
                    ...prev,
                    weight: parseFloat(e.target.value) || 0,
                  }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes"
                value={exerciseForm.notes}
                onChange={(e) =>
                  setExerciseForm((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveExercise}>
              {editingExerciseIndex !== null ? 'Update Exercise' : 'Add Exercise'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Routine Modal */}
      <Dialog open={showEditRoutineModal} onOpenChange={setShowEditRoutineModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Routine</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={routineForm.title}
                onChange={(e) =>
                  setRoutineForm((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={routineForm.description}
                onChange={(e) =>
                  setRoutineForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={routineForm.category}
                onValueChange={(value) =>
                  setRoutineForm((prev) => ({
                    ...prev,
                    category: value as RoutineCategory,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="strength">Strength</SelectItem>
                    <SelectItem value="cardio">Cardio</SelectItem>
                    <SelectItem value="hiit">HIIT</SelectItem>
                    <SelectItem value="flexibility">Flexibility</SelectItem>
                    <SelectItem value="bodyweight">Bodyweight</SelectItem>
                    <SelectItem value="powerlifting">Powerlifting</SelectItem>
                    <SelectItem value="crossfit">CrossFit</SelectItem>
                    <SelectItem value="yoga">Yoga</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select
                value={routineForm.difficulty}
                onValueChange={(value) =>
                  setRoutineForm((prev) => ({
                    ...prev,
                    difficulty: value as RoutineDifficulty,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPublic"
                checked={routineForm.isPublic}
                onCheckedChange={(checked) =>
                  setRoutineForm((prev) => ({
                    ...prev,
                    isPublic: !!checked,
                  }))
                }
              />
              <Label htmlFor="isPublic">Make routine public</Label>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveRoutine}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Routine</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this routine? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteRoutine}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};