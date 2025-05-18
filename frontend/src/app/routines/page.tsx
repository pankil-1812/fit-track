"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Filter, Calendar, Clock, ChevronDown, Edit, Trash2, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  DropdownMenuLabel,
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import Link from "next/link"

// Import mock data
import { routines } from "@/lib/mock-data"

export default function RoutinesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [localRoutines, setLocalRoutines] = useState(routines)
  const [isCreating, setIsCreating] = useState(false)
  const [newRoutine, setNewRoutine] = useState({
    name: "",
    description: "",
    category: "Strength",
    level: "Beginner",
    frequency: "3x per week",
    duration: "45 minutes",
    exercises: []
  })
  
  // Filter routines based on search query and active tab
  const filteredRoutines = localRoutines.filter(routine => {
    // Filter by search query
    const matchesSearch = routine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          routine.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Filter by tab category
    const matchesTab = activeTab === "all" || 
                       routine.category.toLowerCase() === activeTab.toLowerCase()
    
    return matchesSearch && matchesTab
  })
    // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState("")
  const [formSuccess, setFormSuccess] = useState("")
  
  // Function to handle creating a new routine
  const handleCreateRoutine = async () => {
    // Reset states
    setIsSubmitting(true)
    setFormError("")
    setFormSuccess("")
    
    try {
      // Validate form
      if (!newRoutine.name || !newRoutine.description) {
        setFormError("Please fill out all required fields")
        return
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Create new routine with ID
      const newRoutineWithId = {
        ...newRoutine,
        id: localRoutines.length + 1,
        exercises: [],
        history: []
      }
      
      // Add to routines
      setLocalRoutines([...localRoutines, newRoutineWithId])
      setFormSuccess("Routine created successfully!")
      
      // Reset form after delay
      setTimeout(() => {
        setNewRoutine({
          name: "",
          description: "",
          category: "Strength",
          level: "Beginner",
          frequency: "3x per week",
          duration: "45 minutes",
          exercises: []
        })
        setIsCreating(false)
        setFormSuccess("")
      }, 1500)
    } catch (error) {
      console.error("Error creating routine:", error)
      setFormError("Failed to create routine. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }
    // State for delete functionality
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  
  // Function to handle deleting a routine
  const handleDeleteRoutine = async () => {
    if (!deleteId) return
    
    setIsDeleting(true)
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Remove routine from list
      setLocalRoutines(localRoutines.filter(routine => routine.id !== deleteId))
      
      // Show success message or notification here if desired
      setShowDeleteDialog(false)
      setDeleteId(null)
    } catch (error) {
      console.error("Error deleting routine:", error)
      // Handle error case
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">My Workout Routines</h1>
          <p className="text-muted-foreground">
            Create, manage, and track your customized workout routines
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search routines..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" /> 
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>All Routines</DropdownMenuItem>
                <DropdownMenuItem>Recently Used</DropdownMenuItem>
                <DropdownMenuItem>Favorites</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Difficulty</DropdownMenuLabel>
                <DropdownMenuItem>Beginner</DropdownMenuItem>
                <DropdownMenuItem>Intermediate</DropdownMenuItem>
                <DropdownMenuItem>Advanced</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
              <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" /> 
                  New Routine
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Routine</DialogTitle>
                  <DialogDescription>
                    Build a custom workout routine tailored to your fitness goals.
                  </DialogDescription>                </DialogHeader>
                <div className="space-y-4 py-4">
                  {formError && (
                    <div className="p-3 text-sm border border-red-300 bg-red-50 text-red-600 rounded">
                      {formError}
                    </div>
                  )}
                  {formSuccess && (
                    <div className="p-3 text-sm border border-green-300 bg-green-50 text-green-600 rounded">
                      {formSuccess}
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Routine Name</label>
                    <Input 
                      placeholder="e.g., Monday Strength Training" 
                      value={newRoutine.name}
                      onChange={(e) => setNewRoutine({...newRoutine, name: e.target.value})}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Input 
                      placeholder="Brief description of this routine" 
                      value={newRoutine.description}
                      onChange={(e) => setNewRoutine({...newRoutine, description: e.target.value})}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <select 
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={newRoutine.category}
                      onChange={(e) => setNewRoutine({...newRoutine, category: e.target.value})}
                    >
                      <option value="Strength">Strength</option>
                      <option value="Cardio">Cardio</option>
                      <option value="Core">Core</option>
                      <option value="Flexibility">Flexibility</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Level</label>
                    <select 
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={newRoutine.level}
                      onChange={(e) => setNewRoutine({...newRoutine, level: e.target.value})}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreating(false)} disabled={isSubmitting}>Cancel</Button>
                  <Button onClick={handleCreateRoutine} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Creating...
                      </>
                    ) : (
                      "Create Routine"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="strength">Strength</TabsTrigger>
            <TabsTrigger value="cardio">Cardio</TabsTrigger>
            <TabsTrigger value="core">Core</TabsTrigger>
            <TabsTrigger value="flexibility">Flexibility</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRoutines.length > 0 ? (
                filteredRoutines.map((routine) => (
                  <motion.div 
                    key={routine.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{routine.name}</CardTitle>                            <CardDescription className="mt-1 line-clamp-2">
                              {routine.description}
                            </CardDescription>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ChevronDown className="h-4 w-4" />
                                <span className="sr-only">Menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Calendar className="mr-2 h-4 w-4" />
                                Schedule
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => {
                                  setDeleteId(routine.id)
                                  setShowDeleteDialog(true)
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex flex-wrap gap-2 text-xs mb-3">
                          <div className="px-2 py-1 bg-primary/10 text-primary rounded-md flex items-center">
                            {routine.category}
                          </div>
                          <div className="px-2 py-1 bg-muted rounded-md flex items-center">
                            {routine.level}
                          </div>
                        </div>
                        <div className="space-y-1.5 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{routine.frequency}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{routine.duration}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full justify-between group" asChild>
                          <Link href={`/routines/${routine.id}`}>
                            View Exercises
                            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-3 flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted p-3 mb-4">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">No routines found</h3>                  <p className="text-muted-foreground mt-1 mb-4">
                    We couldn&apos;t find any routines matching your search.
                  </p>
                  <Button variant="outline" onClick={() => setSearchQuery("")}>Clear Search</Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Additional tabs for other categories */}
          <TabsContent value="strength" className="mt-0">
            {/* Same structure as "all" tab but filtered for strength */}
          </TabsContent>
          <TabsContent value="cardio" className="mt-0">
            {/* Same structure as "all" tab but filtered for cardio */}
          </TabsContent>
          <TabsContent value="core" className="mt-0">
            {/* Same structure as "all" tab but filtered for core */}
          </TabsContent>
          <TabsContent value="flexibility" className="mt-0">
            {/* Same structure as "all" tab but filtered for flexibility */}
          </TabsContent>
        </Tabs>
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
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteRoutine} 
              disabled={isDeleting}
            >
              {isDeleting ? (
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
