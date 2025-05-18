"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { motion } from "framer-motion"
import { 
  User, Settings, Shield, Camera, Edit, Save
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Form validation schema
const profileFormSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  bio: z.string().max(160).optional(),
  fitnessGoal: z.string().optional(),
  fitnessLevel: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

// Mock user data
const userData = {
  id: "1",
  fullName: "Alex Johnson",
  email: "alex@example.com",
  username: "alexfitpro",
  bio: "Fitness enthusiast and software developer. Always looking to improve!",
  fitnessGoal: "muscle-gain",
  fitnessLevel: "intermediate",
  height: "5'11\"",
  weight: "180",
  avatar: "",
  createdAt: "2023-01-15",
  stats: {
    workoutsCompleted: 87,
    totalWorkoutMinutes: 4320,
    avgWorkoutsPerWeek: 3.5,
    bestStreak: 14,
    currentStreak: 3
  }
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  
  // Default form values from user data
  const defaultValues: Partial<ProfileFormValues> = {
    fullName: userData.fullName,
    email: userData.email,
    username: userData.username,
    bio: userData.bio,
    fitnessGoal: userData.fitnessGoal,
    fitnessLevel: userData.fitnessLevel,
    height: userData.height,
    weight: userData.weight,
  }

  // Initialize form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  })

  // Handle form submission
  function onSubmit(data: ProfileFormValues) {
    // In a real app, you would call your backend API here
    console.log(data)
    // TODO: Add API call to update profile
    setIsEditing(false)
  }

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">
            View and manage your personal information and settings
          </p>
        </div>
        
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal" className="space-y-6">
            {/* Profile Header Card */}
            <Card>
              <CardHeader className="relative">
                <div className="absolute right-6 top-6">
                  {isEditing ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={form.handleSubmit(onSubmit)}
                      className="gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsEditing(true)}
                      className="gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={userData.avatar || ""} alt={userData.fullName} />
                      <AvatarFallback className="text-2xl">
                        {userData.fullName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <div className="absolute bottom-0 right-0 rounded-full bg-primary p-1 text-primary-foreground">
                        <Camera className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{userData.fullName}</CardTitle>
                    <CardDescription className="text-md">@{userData.username}</CardDescription>
                    <p className="text-sm text-muted-foreground mt-1">
                      Member since {new Date(userData.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-8">
                <Form {...form}>
                  <form className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                disabled={!isEditing} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid gap-6 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="height"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Height</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  disabled={!isEditing}
                                  placeholder="e.g., 5'11\"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="weight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Weight (lbs)</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  disabled={!isEditing}
                                  placeholder="e.g., 180"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              disabled={!isEditing}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="fitnessGoal"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Fitness Goal</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value} 
                              disabled={!isEditing}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your primary fitness goal" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="weight-loss">Weight Loss</SelectItem>
                                <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                                <SelectItem value="endurance">Improve Endurance</SelectItem>
                                <SelectItem value="strength">Build Strength</SelectItem>
                                <SelectItem value="flexibility">Increase Flexibility</SelectItem>
                                <SelectItem value="general">General Fitness</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="fitnessLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fitness Level</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value} 
                              disabled={!isEditing}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your fitness level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="advanced">Advanced</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            {/* Fitness Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle>Fitness Stats</CardTitle>
                <CardDescription>Your fitness achievements and statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                  <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                    <span className="text-2xl font-bold">{userData.stats.workoutsCompleted}</span>
                    <span className="text-sm text-muted-foreground text-center">Workouts Completed</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                    <span className="text-2xl font-bold">{userData.stats.totalWorkoutMinutes}</span>
                    <span className="text-sm text-muted-foreground text-center">Total Minutes</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                    <span className="text-2xl font-bold">{userData.stats.avgWorkoutsPerWeek}</span>
                    <span className="text-sm text-muted-foreground text-center">Weekly Average</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                    <span className="text-2xl font-bold">{userData.stats.currentStreak}</span>
                    <span className="text-sm text-muted-foreground text-center">Current Streak</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Manage your app preferences and settings</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Units</h3>
                    <div className="grid gap-4">
                      <div className="flex items-center gap-4 justify-between">
                        <div>
                          <Label htmlFor="weight-unit">Weight</Label>
                          <p className="text-sm text-muted-foreground">Choose your preferred weight unit</p>
                        </div>
                        <Select defaultValue="lbs">
                          <SelectTrigger className="w-[180px]" id="weight-unit">
                            <SelectValue placeholder="Select weight unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                            <SelectItem value="kg">Kilograms (kg)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Separator />
                      <div className="flex items-center gap-4 justify-between">
                        <div>
                          <Label htmlFor="distance-unit">Distance</Label>
                          <p className="text-sm text-muted-foreground">Choose your preferred distance unit</p>
                        </div>
                        <Select defaultValue="mi">
                          <SelectTrigger className="w-[180px]" id="distance-unit">
                            <SelectValue placeholder="Select distance unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mi">Miles (mi)</SelectItem>
                            <SelectItem value="km">Kilometers (km)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-2">Notifications</h3>
                    <div className="space-y-4">
                      {/* Notification settings would go here */}
                      <p className="text-sm text-muted-foreground">Notification settings will be implemented in the next phase.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Save Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security and privacy</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Change Password</h3>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                    </div>
                    <Button className="mt-4">Update Password</Button>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground mb-4">Add an extra layer of security to your account</p>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-2 text-destructive">Danger Zone</h3>
                    <p className="text-sm text-muted-foreground mb-4">Permanently delete your account and all of your data</p>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
