"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { 
  ArrowLeft,
  Check,
  Users,
  Calendar,
  Trophy,
  // Share2,  // Commented out as it's not used
  AlertCircle,
  Clock,
  Award
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  // CardFooter,  // Commented out as it's not used
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

// Import custom data hooks for API integration
import { useChallenge, Challenge, ChallengeDay } from "../../../lib/data-hooks"

export default function ChallengeDetailPage({ params }: { params: { id: string } }) {
  const { challenge, status } = useChallenge(params.id)
  const [isJoined, setIsJoined] = useState(false)
  
  // Loading state is derived from the status
  const loading = status === "loading" || status === "idle"

  if (loading) {
    return (
      <div className="container py-8 max-w-5xl">
        <div className="flex flex-col space-y-6 items-center justify-center min-h-[400px]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
          <p className="text-muted-foreground">Loading challenge details...</p>
        </div>
      </div>
    )
  }

  if (!challenge) {
    return (
      <div className="container py-8 max-w-5xl">
        <div className="flex flex-col space-y-6 items-center justify-center min-h-[400px]">
          <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-900">
            <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-xl font-medium">Challenge Not Found</h3>
          <p className="text-muted-foreground text-center max-w-md">
            We could not find the challenge you are looking for. It may have been removed or you may have followed an invalid link.
          </p>
          <Button asChild>
            <Link href="/challenges">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Challenges
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
            <Link href="/challenges">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Challenges
            </Link>
          </Button>
        </div>
        
        {/* Challenge header with image banner */}
        <div className="relative w-full h-64 rounded-lg overflow-hidden">
          {challenge.image ? (
            <Image 
              src={challenge.image}
              fill
              alt={challenge.name}
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <Trophy className="h-20 w-20 text-muted-foreground" />
            </div>
          )}
          
          {/* Overlay gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent"></div>
          
          {/* Challenge title and description */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h1 className="text-3xl font-bold tracking-tight">{challenge.name}</h1>
            <p className="text-lg mt-2 max-w-2xl">
              {challenge.description}
            </p>
          </div>
        </div>
        
        {/* Challenge stats cards */}
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
                Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium">{challenge.duration}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                Participants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium">{challenge.participants}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Award className="h-4 w-4 mr-2 text-muted-foreground" />
                Difficulty
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium">{challenge.difficulty}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-lg font-medium">{challenge.progress}%</p>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: `${challenge.progress}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Join challenge button */}
        <div className="flex justify-center">
          <Button 
            size="lg" 
            className="px-8"
            onClick={() => setIsJoined(!isJoined)}
          >
            {isJoined ? 'Leave Challenge' : 'Join Challenge'}
          </Button>
        </div>
        
        {/* Challenge content tabs */}
        <Tabs defaultValue="overview" className="w-full mt-6">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
          </TabsList>
          
          {/* Overview tab content */}
          <TabsContent value="overview" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About This Challenge</CardTitle>
                <CardDescription>Challenge details and rewards</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium text-lg mb-2">Description</h3>
                  <p>
                    {challenge.description}
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium text-lg mb-2">How It Works</h3>
                  <p>
                    Complete daily tasks over {challenge.duration} to finish this challenge. 
                    Each day has specific targets that you need to meet. Mark your progress daily 
                    to stay on track and see your progress.
                  </p>
                  
                  <div className="mt-4 flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="rounded-full bg-primary/10 p-3 mb-2">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-sm font-medium">Daily Tasks</p>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="rounded-full bg-primary/10 p-3 mb-2">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-sm font-medium">Track Progress</p>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="rounded-full bg-primary/10 p-3 mb-2">
                        <Trophy className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-sm font-medium">Earn Rewards</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium text-lg mb-2">Rewards</h3>
                  <p>
                    Complete this challenge to earn:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Challenge Completion Badge</li>
                    <li>500 FitTrack Points</li>
                    <li>Entry into monthly prize drawing</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Schedule tab content */}
          <TabsContent value="schedule" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Challenge Schedule</CardTitle>
                <CardDescription>Daily tasks and progress tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Timeline view of challenge days */}
                  <div className="space-y-4">
                    {challenge.days && challenge.days.map((day: ChallengeDay, index: number) => (
                      <div key={index} className="flex">
                        <div className="mr-4 flex flex-col items-center">
                          <div className={`rounded-full p-1 ${day.completed ? 'bg-primary' : 'bg-muted'}`}>
                            <Check className={`h-4 w-4 ${day.completed ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                          </div>
                          {index < (challenge.days?.length - 1) && (
                            <div className="h-full w-px bg-muted my-1"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div>
                              <p className="font-medium">Day {day.day}</p>
                              <p className="text-sm text-muted-foreground">{day.target}</p>
                            </div>
                            <Button 
                              variant={day.completed ? "outline" : "default"} 
                              size="sm" 
                              className="mt-2 md:mt-0"
                              disabled={day.completed}
                            >
                              {day.completed ? 'Completed' : 'Mark Complete'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Placeholder for days not defined in the mock data */}
                  <div className="text-center text-muted-foreground text-sm">
                    More days will be revealed as you progress...
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Participants tab content */}
          <TabsContent value="participants" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Challenge Participants</CardTitle>
                <CardDescription>{challenge.participants} people joined this challenge</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Top performers */}
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Top Performers</h3>
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar>
                                <AvatarFallback>{`U${i}`}</AvatarFallback>
                              </Avatar>
                              <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">
                                {i}
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium">User Name {i}</p>
                              <div className="flex items-center gap-1">
                                <p className="text-xs text-muted-foreground">Progress: {100 - (i * 5)}%</p>
                              </div>
                            </div>
                          </div>
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary" 
                              style={{ width: `${100 - (i * 5)}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Recent joiners */}
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Recently Joined</h3>
                    <div className="flex flex-wrap gap-2">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <Avatar key={`recent-${i}`}>
                          <AvatarFallback>{`U${i}`}</AvatarFallback>
                        </Avatar>
                      ))}
                      <div className="flex items-center justify-center bg-muted rounded-full h-10 w-10">
                        <span className="text-xs text-muted-foreground">+{challenge.participants - 10}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Friends section */}
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Your Friends in This Challenge</h3>
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        None of your friends have joined this challenge yet.
                      </p>
                      <Button variant="outline" className="mt-4">
                        Invite Friends
                      </Button>
                    </div>
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
