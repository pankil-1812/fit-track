"use client"

import { useState } from "react"
import { Plus, Search, Calendar, Clock, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

// Import hooks, services and types
import { useRoutines } from "@/lib/data-hooks"
import { routineService } from "@/lib/api"
import { CreateRoutineData, Exercise, RoutineCategory, RoutineDifficulty } from "@/lib/types"

export default function RoutinesPage() {
  const { routines, mutate } = useRoutines();
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  // Create routine state
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newRoutine, setNewRoutine] = useState<CreateRoutineData>({
    title: "",
    description: "",
    category: "strength",
    difficulty: "intermediate",
    isPublic: false,
    exercises: [],
    tags: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Exercise form state
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [exerciseForm, setExerciseForm] = useState<Exercise>({
    name: "",
    description: "",
    sets: 3,
    reps: 10,
    duration: 0,
    restTime: 60,
    weight: 0,
    notes: "",
  });
  const [editingExerciseIndex, setEditingExerciseIndex] = useState<number | null>(null);
  const handleCreateRoutine = async () => {
    try {
      setIsSubmitting(true);

      // Validate form
      if (!newRoutine.title || !newRoutine.description) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      if (newRoutine.exercises.length === 0) {
        toast({
          title: "Error",
          description: "Please add at least one exercise",
          variant: "destructive"
        });
        return;
      }

      // Create routine
      await routineService.createRoutine(newRoutine);

      // Show success message
      toast({
        title: "Success",
        description: "Routine created successfully",
      });

      // Reset form and close dialog
      setNewRoutine({
        title: "",
        description: "",
        category: "strength",
        difficulty: "intermediate",
        isPublic: false,
        exercises: [],
        tags: []
      });
      setShowCreateDialog(false);

      // Refresh routines list
      mutate();

    } catch (err) {
      // Show error message
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to create routine",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddExercise = () => {
    if (!exerciseForm.name) {
      toast({
        title: "Error",
        description: "Exercise name is required",
        variant: "destructive"
      });
      return;
    }

    setNewRoutine(prev => ({
      ...prev,
      exercises: [...prev.exercises, exerciseForm]
    }));
    setExerciseForm({
      name: "",
      description: "",
      sets: 3,
      reps: 10,
      duration: 0,
      restTime: 60,
      weight: 0,
      notes: "",
    });
    setShowExerciseModal(false);
  };

  const handleEditExercise = (index: number) => {
    setExerciseForm(newRoutine.exercises[index]);
    setEditingExerciseIndex(index);
    setShowExerciseModal(true);
  };

  const handleUpdateExercise = () => {
    if (editingExerciseIndex === null) return;

    setNewRoutine(prev => {
      const updatedExercises = [...prev.exercises];
      updatedExercises[editingExerciseIndex] = exerciseForm;
      return { ...prev, exercises: updatedExercises };
    });

    setExerciseForm({
      name: "",
      description: "",
      sets: 3,
      reps: 10,
      duration: 0,
      restTime: 60,
      weight: 0,
      notes: "",
    });
    setEditingExerciseIndex(null);
    setShowExerciseModal(false);
  };

  const handleDeleteExercise = (index: number) => {
    setNewRoutine(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  const handleDeleteRoutine = async () => {
    if (!deleteId) return;

    try {
      setIsSubmitting(true);
      await routineService.deleteRoutine(deleteId);
      toast({
        title: "Success",
        description: "Routine deleted successfully",
      });
      setShowDeleteDialog(false);
      mutate();
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to delete routine",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter routines based on search query and active tab
  const filteredRoutines = routines.filter(routine => {
    const matchesSearch = routine.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      routine.description.toLowerCase().includes(searchQuery.toLowerCase());

    switch (activeTab) {
      case "my":
        return matchesSearch && !routine.isPublic;
      case "public":
        return matchesSearch && routine.isPublic;
      default:
        return matchesSearch;
    }
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Workout Routines</h1>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Routine
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create New Routine</DialogTitle>
              <DialogDescription>
                Create a new workout routine. Add exercises and customize your workout plan.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">Title</label>
                  <Input
                    id="title"
                    placeholder="Routine title"
                    value={newRoutine.title}
                    onChange={e => setNewRoutine(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">Category</label>
                  <Select
                    value={newRoutine.category}
                    onValueChange={value => setNewRoutine(prev => ({ ...prev, category: value as RoutineCategory }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Categories</SelectLabel>
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
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Textarea
                  id="description"
                  placeholder="Describe your routine..."
                  value={newRoutine.description}
                  onChange={e => setNewRoutine(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="difficulty" className="text-sm font-medium">Difficulty</label>
                  <Select
                    value={newRoutine.difficulty}
                    onValueChange={value => setNewRoutine(prev => ({ ...prev, difficulty: value as RoutineDifficulty }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Difficulty</SelectLabel>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="visibility" className="text-sm font-medium">Visibility</label>
                  <Select
                    value={newRoutine.isPublic ? "public" : "private"}
                    onValueChange={value => setNewRoutine(prev => ({ ...prev, isPublic: value === "public" }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Visibility</SelectLabel>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="public">Public</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">Exercises</h4>
                  <Dialog open={showExerciseModal} onOpenChange={setShowExerciseModal}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Exercise
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingExerciseIndex !== null ? "Edit Exercise" : "Add Exercise"}</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <label htmlFor="exerciseName" className="text-sm font-medium">Name</label>
                          <Input
                            id="exerciseName"
                            placeholder="Exercise name"
                            value={exerciseForm.name}
                            onChange={e => setExerciseForm(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label htmlFor="sets" className="text-sm font-medium">Sets</label>
                            <Input
                              id="sets"
                              type="number"
                              min="1"
                              value={exerciseForm.sets}
                              onChange={e => setExerciseForm(prev => ({ ...prev, sets: parseInt(e.target.value) || 1 }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="reps" className="text-sm font-medium">Reps</label>
                            <Input
                              id="reps"
                              type="number"
                              min="1"
                              value={exerciseForm.reps}
                              onChange={e => setExerciseForm(prev => ({ ...prev, reps: parseInt(e.target.value) || 1 }))}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label htmlFor="duration" className="text-sm font-medium">Duration (seconds)</label>
                            <Input
                              id="duration"
                              type="number"
                              min="0"
                              value={exerciseForm.duration}
                              onChange={e => setExerciseForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="restTime" className="text-sm font-medium">Rest Time (seconds)</label>
                            <Input
                              id="restTime"
                              type="number"
                              min="0"
                              value={exerciseForm.restTime}
                              onChange={e => setExerciseForm(prev => ({ ...prev, restTime: parseInt(e.target.value) || 0 }))}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="weight" className="text-sm font-medium">Weight (optional)</label>
                          <Input
                            id="weight"
                            type="number"
                            min="0"
                            step="0.5"
                            value={exerciseForm.weight}
                            onChange={e => setExerciseForm(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="notes" className="text-sm font-medium">Notes (optional)</label>
                          <Textarea
                            id="notes"
                            placeholder="Any additional notes..."
                            value={exerciseForm.notes}
                            onChange={e => setExerciseForm(prev => ({ ...prev, notes: e.target.value }))}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={editingExerciseIndex !== null ? handleUpdateExercise : handleAddExercise}>
                          {editingExerciseIndex !== null ? "Update Exercise" : "Add Exercise"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="space-y-2">
                  {newRoutine.exercises.map((exercise, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{exercise.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {exercise.sets} sets × {exercise.reps} reps
                          {exercise.weight ? ` @ ${exercise.weight}kg` : ''}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" onClick={() => handleEditExercise(index)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDeleteExercise(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateRoutine} disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Routine'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Input
              placeholder="Search routines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              prefix={<Search className="h-4 w-4" />}
            />
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Routines</TabsTrigger>
              <TabsTrigger value="my">My Routines</TabsTrigger>
              <TabsTrigger value="public">Public Routines</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoutines.map((routine) => (
            <Link key={routine._id} href={`/routines/${routine._id}`}>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{routine.title}</CardTitle>
                      <CardDescription className="mt-2">{routine.description}</CardDescription>
                    </div>
                    {!routine.isPublic && (
                      <div className="px-2 py-1 text-xs bg-gray-100 rounded-full">
                        Private
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {routine.difficulty}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {routine.estimatedDuration} min
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-sm font-medium">Exercises:</div>
                    <div className="text-sm text-muted-foreground">
                      {routine.exerciseCount} exercises
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

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
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteRoutine}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
