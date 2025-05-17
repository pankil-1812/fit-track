"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Edit, 
  PlayCircle, 
  Share2, 
  Star, 
  ChevronDown, 
  Dumbbell, 
  Timer,
  AlertCircle,
  Trash2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
// Import custom data hooks for API integration
import { useRoutine, Routine, Exercise, WorkoutSession } from "../../../lib/data-hooks"

export default function RoutineDetailPage({ params }: { params: { id: string } }) {  const { routine, status } = useRoutine(params.id)
  const [isStarred, setIsStarred] = useState(false)
  
  // Loading state is derived from the status
  const loading = status === "loading" || status === "idle"

  if (loading) {
    return (
      <div className="container py-8 max-w-5xl">
        <div className="flex flex-col space-y-6 items-center justify-center min-h-[400px]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
          <p className="text-muted-foreground">Loading routine details...</p>
        </div>
      </div>
    )
  }

  if (!routine) {
    return (
      <div className="container py-8 max-w-5xl">
        <div className="flex flex-col space-y-6 items-center justify-center min-h-[400px]">
          <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-900">
            <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>          <h3 className="text-xl font-medium">Routine Not Found</h3>
          <p className="text-muted-foreground text-center max-w-md">
            We couldn&apos;t find the routine you&apos;re looking for. It may have been removed or you may have followed an invalid link.
          </p>
          <Button asChild>
            <Link href="/routines">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Routines
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 max-w-5xl">
      <div className="flex flex-col space-y-6">
        {/* Back navigation */}
        <div>
          <Button variant="ghost" className="pl-0 mb-4" asChild>
            <Link href="/routines">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Routines
            </Link>
          </Button>
        </div>
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{routine.name}</h1>
            <p className="text-muted-foreground mt-1 max-w-2xl">
              {routine.description}
            </p>
          </div>
          
          <div className="flex gap-2 self-start">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setIsStarred(!isStarred)}
            >
              <Star className={`h-4 w-4 ${isStarred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
              <span className="sr-only">Favorite</span>
            </Button>
            
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Share</span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <ChevronDown className="h-4 w-4" />
                  <span className="sr-only">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Routine
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Start Workout
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Routine
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button className="gap-2">
              <PlayCircle className="h-4 w-4" />
              Start Workout
            </Button>
          </div>
        </div>
        
        {/* Routine metadata cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                Frequency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium">{routine.frequency}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium">{routine.duration}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Dumbbell className="h-4 w-4 mr-2 text-muted-foreground" />
                Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium">{routine.level}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Dumbbell className="h-4 w-4 mr-2 text-muted-foreground" />
                Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium">{routine.category}</p>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Tabs for exercises and history */}
        <Tabs defaultValue="exercises" className="w-full mt-6">
          <TabsList className="mb-6">
            <TabsTrigger value="exercises">Exercises</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
          
          {/* Exercises tab content */}
          <TabsContent value="exercises" className="mt-0">
            <div className="grid gap-4">
              {routine.exercises.map((exercise: Exercise, index: number) => (
                <motion.div
                  key={`${exercise.name}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{exercise.name}</h3>
                          <div className="flex gap-2 items-center mt-2 text-sm text-muted-foreground">
                            <div className="flex gap-1 items-center">
                              <div className="h-2 w-2 bg-primary rounded-full"></div>
                              <span>{exercise.sets} sets</span>
                            </div>
                            <div className="flex gap-1 items-center">
                              <div className="h-2 w-2 bg-primary rounded-full"></div>
                              <span>{exercise.reps}</span>
                            </div>
                            <div className="flex gap-1 items-center">
                              <Timer className="h-4 w-4" />
                              <span>{exercise.rest} rest</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="whitespace-nowrap">
                                Exercise Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>{exercise.name}</DialogTitle>
                                <DialogDescription>
                                  Exercise details and instructions
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div>
                                  <h4 className="font-medium mb-2">Instructions</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Detailed instructions would go here. This would typically include proper form, breathing techniques, and common mistakes to avoid.
                                  </p>
                                </div>
                                
                                <div>
                                  <h4 className="font-medium mb-2">Target Muscles</h4>
                                  <div className="flex flex-wrap gap-2 text-xs">
                                    <div className="px-2 py-1 bg-primary/10 text-primary rounded-md">
                                      Primary Muscle Group
                                    </div>
                                    <div className="px-2 py-1 bg-muted rounded-md">
                                      Secondary Muscle Group
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            {/* Add exercise button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full mt-4">
                  + Add Exercise
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Exercise</DialogTitle>
                  <DialogDescription>
                    Add a new exercise to this routine
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Exercise Name</label>
                    <Input placeholder="e.g., Bench Press" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Sets</label>
                      <Input type="number" placeholder="3" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Reps</label>
                      <Input placeholder="8-12" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Rest</label>
                      <Input placeholder="60 sec" />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Add Exercise</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
          
          {/* History tab content */}
          <TabsContent value="history" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Workout History</CardTitle>
                <CardDescription>
                  Previous workout sessions using this routine
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">                  {routine.history ? (
                    routine.history.map((session: WorkoutSession, index: number) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{session.date}</p>
                          <p className="text-sm text-muted-foreground">{session.duration} • {session.exercises.length} exercises</p>
                        </div>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="rounded-full bg-muted p-3 mb-4">
                        <Calendar className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium">No workout history</h3>                      <p className="text-muted-foreground mt-1 mb-4">
                        You haven&apos;t completed any workouts with this routine yet.
                      </p>
                      <Button>Start Workout</Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notes tab content */}
          <TabsContent value="notes" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Routine Notes</CardTitle>
                <CardDescription>
                  Add personal notes and observations about this routine
                </CardDescription>
              </CardHeader>
              <CardContent>
                <textarea 
                  className="w-full min-h-[200px] p-4 rounded-md border border-input bg-transparent resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Add your notes here. For example: &apos;Increase weight on bench press next time&apos; or &apos;Focus on better form for squats&apos;"
                ></textarea>
                <div className="mt-4 flex justify-end">
                  <Button>Save Notes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
