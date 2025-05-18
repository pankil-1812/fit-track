"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, BarChart2, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { format, addDays, subDays } from "date-fns"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

// Mock data for workout logs
const workoutLogs = [
  {
    id: 1,
    date: new Date(2025, 4, 15), // May 15, 2025
    routineName: "Full Body Strength",
    duration: "48 minutes",
    caloriesBurned: 320,
    exercises: [
      { name: "Squats", sets: 4, reps: [10, 10, 8, 8], weight: "135 lbs", notes: "Increased weight from last session" },
      { name: "Bench Press", sets: 4, reps: [10, 8, 8, 6], weight: "155 lbs", notes: "" },
      { name: "Deadlifts", sets: 3, reps: [8, 8, 6], weight: "185 lbs", notes: "Focused on form" },
      { name: "Shoulder Press", sets: 3, reps: [12, 10, 10], weight: "65 lbs", notes: "" },
    ],
    mood: "Energetic",
    notes: "Great session overall. Could push harder on bench press next time."
  },
  {
    id: 2,
    date: new Date(2025, 4, 13), // May 13, 2025
    routineName: "HIIT Cardio Blast",
    duration: "32 minutes",
    caloriesBurned: 380,
    exercises: [
      { name: "Jumping Jacks", sets: 3, reps: ["30 sec", "30 sec", "30 sec"], weight: "bodyweight", notes: "" },
      { name: "Burpees", sets: 3, reps: ["30 sec", "30 sec", "25 sec"], weight: "bodyweight", notes: "Struggling with the last set" },
      { name: "Mountain Climbers", sets: 3, reps: ["30 sec", "30 sec", "30 sec"], weight: "bodyweight", notes: "" },
      { name: "Plank Jacks", sets: 3, reps: ["30 sec", "25 sec", "20 sec"], weight: "bodyweight", notes: "Need to improve endurance" },
    ],
    mood: "Tired",
    notes: "Pushed through despite feeling low energy. Need more rest next time."
  },
  {
    id: 3,
    date: new Date(2025, 4, 10), // May 10, 2025
    routineName: "Upper Body Focus",
    duration: "42 minutes",
    caloriesBurned: 290,
    exercises: [
      { name: "Push-ups", sets: 3, reps: [12, 12, 10], weight: "bodyweight", notes: "" },
      { name: "Dumbbell Rows", sets: 3, reps: [12, 12, 12], weight: "45 lbs", notes: "Good form throughout" },
      { name: "Lateral Raises", sets: 3, reps: [15, 12, 12], weight: "15 lbs", notes: "" },
      { name: "Bicep Curls", sets: 3, reps: [15, 12, 12], weight: "25 lbs", notes: "Increased weight" },
      { name: "Tricep Dips", sets: 3, reps: [15, 12, 10], weight: "bodyweight", notes: "Need to work on tricep strength" },
    ],
    mood: "Focused",
    notes: "Great pump today. Arms feel stronger than last session."
  },
]

export default function WorkoutLogsPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  
  // Function to get logs for the selected date
  const getLogsForSelectedDate = () => {
    return workoutLogs.filter(log => 
      log.date.getDate() === selectedDate.getDate() && 
      log.date.getMonth() === selectedDate.getMonth() && 
      log.date.getFullYear() === selectedDate.getFullYear()
    )
  }
  
  // Function to navigate between dates
  const navigateDate = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setSelectedDate(subDays(selectedDate, 1))
    } else {
      setSelectedDate(addDays(selectedDate, 1))
    }
  }

  const selectedLogs = getLogsForSelectedDate()
  const formattedDate = format(selectedDate, 'EEEE, MMMM d, yyyy')
  
  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Workout Log</h1>
          <p className="text-muted-foreground">
            Track your exercise performance and monitor your progress
          </p>
        </div>
        
        <Tabs defaultValue="daily" className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" /> 
                  Log Workout
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">                <DialogHeader>
                  <DialogTitle>Log New Workout</DialogTitle>
                  <DialogDescription>
                    Record the details of your completed workout session.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Workout Date</label>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 opacity-50" />
                      <input 
                        type="date" 
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        defaultValue={format(new Date(), "yyyy-MM-dd")}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Routine</label>
                    <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                      <option value="">Choose a routine</option>
                      <option value="1">Full Body Strength</option>
                      <option value="2">HIIT Cardio Blast</option>
                      <option value="3">Upper Body Focus</option>
                      <option value="4">Core Crusher</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Duration</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        placeholder="45"
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                      />
                      <span className="text-sm">minutes</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">How did you feel?</label>
                    <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                      <option value="Great">Great - Full of energy</option>
                      <option value="Good">Good - Normal energy levels</option>
                      <option value="Average">Average - Could have been better</option>
                      <option value="Tired">Tired - Low energy</option>
                      <option value="Exhausted">Exhausted - Very difficult to complete</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Notes (Optional)</label>
                    <textarea 
                      placeholder="Add any comments about your workout..."
                      className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2"
                    ></textarea>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={() => alert("Workout logged successfully!")}>Save Workout</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <TabsContent value="daily" className="mt-0 space-y-4">
            <div className="flex items-center justify-between">
              <Button variant="outline" size="icon" onClick={() => navigateDate('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-medium">{formattedDate}</h2>
              <Button variant="outline" size="icon" onClick={() => navigateDate('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid gap-4">
              {selectedLogs.length > 0 ? (
                selectedLogs.map((log) => (
                  <motion.div 
                    key={log.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{log.routineName}</CardTitle>
                            <CardDescription className="text-xs">
                              {format(log.date, 'h:mm a')} • {log.duration} • {log.caloriesBurned} calories
                            </CardDescription>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <BarChart2 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Award className="h-4 w-4" />
                              </Button>
                            </div>
                            <span className="text-xs text-muted-foreground mt-1">Mood: {log.mood}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {log.exercises.map((exercise, i) => (
                            <div key={i} className="text-sm">
                              <div className="flex justify-between">
                                <span className="font-medium">{exercise.name}</span>
                                <span className="text-muted-foreground">{exercise.weight}</span>
                              </div>
                              <div className="flex gap-2 mt-1">
                                {exercise.reps.map((rep, j) => (
                                  <div key={j} className="px-2 py-1 bg-muted rounded-md text-xs">
                                    {rep} {typeof rep === 'number' ? 'reps' : ''}
                                  </div>
                                ))}
                              </div>
                              {exercise.notes && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Note: {exercise.notes}
                                </p>
                              )}
                              {i < log.exercises.length - 1 && <Separator className="my-2" />}
                            </div>
                          ))}
                        </div>
                        {log.notes && (
                          <div className="mt-4 pt-3 border-t">
                            <p className="text-sm italic">"{log.notes}"</p>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button variant="outline" className="w-full" size="sm">
                          Edit Log
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="rounded-full mx-auto bg-muted p-3 mb-4 w-12 h-12 flex items-center justify-center">
                    <CalendarIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">No workouts logged</h3>
                  <p className="text-muted-foreground mt-1 mb-4">
                    You haven't logged any workouts for this day yet.
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Log a Workout</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Log New Workout</DialogTitle>
                        <DialogDescription>
                          Record the details of your completed workout session.
                        </DialogDescription>
                      </DialogHeader>
                      {/* Form fields would go here */}
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="calendar">
            <div className="py-8 text-center text-muted-foreground">
              Calendar view will be implemented in the next phase.
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <div className="py-8 text-center text-muted-foreground">
              History and statistics will be implemented in the next phase.
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
