"use client"

import { useState, useEffect } from "react"
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
  Award,
  Loader2
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
import { toast } from "@/components/ui/use-toast"
import { challengeService } from "@/lib/api"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

// Import custom data hooks for API integration
import { useChallenge, type ChallengeDay } from "../../../lib/data-hooks"

// ChallengeDaysTimeline component with proper state management
const ChallengeDaysTimeline = ({ days, challengeId }: { days: ChallengeDay[], challengeId: string }) => {
  const [completedDays, setCompletedDays] = useState<Record<number, boolean>>({});
  const [isUpdating, setIsUpdating] = useState<number | null>(null);

  // Initialize completed state from the days prop
  useEffect(() => {
    if (days) {
      const initialState = days.reduce((acc, day) => {
        acc[day.day] = day.completed;
        return acc;
      }, {} as Record<number, boolean>);

      // Check if we have local storage data for this challenge
      const storedProgress = localStorage.getItem(`challenge-${challengeId}-progress`);
      if (storedProgress) {
        try {
          const parsedProgress = JSON.parse(storedProgress);
          setCompletedDays(parsedProgress);
        } catch (e) {
          console.error("Error parsing stored challenge progress:", e);
          setCompletedDays(initialState);
        }
      } else {
        setCompletedDays(initialState);
      }
    }
  }, [days, challengeId]);

  // Persist completed days to localStorage
  useEffect(() => {
    if (Object.keys(completedDays).length > 0) {
      localStorage.setItem(`challenge-${challengeId}-progress`, JSON.stringify(completedDays));
    }
  }, [completedDays, challengeId]);

  // Handle marking a day as complete
  const handleMarkComplete = async (day: number) => {
    setIsUpdating(day);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      // Update state
      setCompletedDays(prev => ({
        ...prev,
        [day]: true
      }));

      // Show feedback to user
      toast({
        title: "Day marked complete!",
        description: `You've completed day ${day}. Great work!`,
      });
    } catch (error) {
      console.error("Error updating challenge progress:", error);
      toast({
        title: "Error",
        description: "Failed to update your progress. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  if (!days || days.length === 0) {
    return <p>No challenge days available yet.</p>;
  }

  return (
    <>
      {days.map((day, index) => {
        const isCompleted = completedDays[day.day] || false;

        return (
          <div key={index} className="flex">
            <div className="mr-4 flex flex-col items-center">
              <div className={`rounded-full p-1 ${isCompleted ? 'bg-primary' : 'bg-muted'}`}>
                <Check className={`h-4 w-4 ${isCompleted ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
              </div>
              {index < (days.length - 1) && (
                <div className="h-full w-px bg-muted my-1"></div>
              )}
            </div>
            <div className="flex-1 pb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <p className="font-medium">Day {day.day}</p>
                  <p className="text-sm text-muted-foreground">{day.target}</p>
                </div>                <Button
                  variant={isCompleted ? "outline" : "default"}
                  size="sm"
                  className="mt-2 md:mt-0"
                  disabled={isCompleted || isUpdating === day.day}
                  onClick={() => handleMarkComplete(day.day)}
                >
                  {isUpdating === day.day ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    isCompleted ? 'Completed' : 'Mark Complete'
                  )}
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default function ChallengeDetailPage({ params }: { params: { id: string } }) {
  const { challenge, status } = useChallenge(params.id)
  const [isJoined, setIsJoined] = useState(false)
  const [showJoinConfirmation, setShowJoinConfirmation] = useState(false)
  const [isLoadingAction, setIsLoadingAction] = useState(false)

  // Loading state is derived from the status
  const loading = status === "loading" || status === "idle"

  // Check if user is already participating in this challenge
  useEffect(() => {
    if (challenge) {
      // This would typically come from the API response
      // For now we're using localStorage to persist the joined state
      const joinedChallenges = localStorage.getItem('joinedChallenges')
      if (joinedChallenges) {
        const challenges = JSON.parse(joinedChallenges)
        setIsJoined(challenges.includes(Number(params.id)))
      }
    }
  }, [challenge, params.id])

  // Handle joining or leaving challenge
  const toggleChallengeParticipation = () => {
    if (isJoined) {
      // If already joined, ask for confirmation before leaving
      if (confirm("Are you sure you want to leave this challenge? Your progress will be lost.")) {
        handleLeaveChallenge()
      }
    } else {
      // If not joined, show confirmation dialog
      setShowJoinConfirmation(true)
    }
  }

  // Handle leaving challenge
  const handleLeaveChallenge = async () => {
    setIsLoadingAction(true)

    try {
      // Call API to leave challenge
      if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800))

        // Update local storage for persistence between page refreshes
        const joinedChallenges = localStorage.getItem('joinedChallenges')
        if (joinedChallenges) {
          const challenges = JSON.parse(joinedChallenges)
          localStorage.setItem(
            'joinedChallenges',
            JSON.stringify(challenges.filter((id: number) => id !== Number(params.id)))
          )
        }
      } else {
        // Real API call
        await challengeService.leaveChallenge(params.id)
      }

      setIsJoined(false)
      // Show feedback
      toast({
        title: "Challenge left",
        description: "We hope to see you in another challenge soon!",
        variant: "default",
      })
    } catch (error) {
      console.error("Error leaving challenge:", error)
      toast({
        title: "Error",
        description: "Failed to leave the challenge. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingAction(false)
    }
  }

  // Handle confirming challenge join
  const confirmJoinChallenge = async () => {
    setIsLoadingAction(true)
    setShowJoinConfirmation(false)

    try {
      // Call API to join challenge
      if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800))

        // Update local storage for persistence between page refreshes
        const joinedChallenges = localStorage.getItem('joinedChallenges')
        const challenges = joinedChallenges ? JSON.parse(joinedChallenges) : []
        if (!challenges.includes(Number(params.id))) {
          challenges.push(Number(params.id))
        }
        localStorage.setItem('joinedChallenges', JSON.stringify(challenges))
      } else {
        // Real API call
        await challengeService.joinChallenge(params.id)
      }

      setIsJoined(true)
      toast({
        title: "Challenge joined",
        description: "Good luck with your challenge!",
        variant: "default",
      })
    } catch (error) {
      console.error("Error joining challenge:", error)
      toast({
        title: "Error",
        description: "Failed to join the challenge. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingAction(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 max-w-5xl">
        <div className="flex flex-col space-y-6 items-center justify-center min-h-[400px]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
          <p className="text-muted-foreground">Loading challenge details...</p>
        </div>
      </div>
    )
  }

  if (!challenge) {
    return (
      <div className="container mx-auto py-8 max-w-5xl">
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
    <div className="container mx-auto py-8 max-w-5xl">
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
        </motion.div>          {/* Join challenge button */}
        <div className="flex justify-center">
          <Button
            size="lg"
            className="px-8"
            onClick={toggleChallengeParticipation}
            disabled={isLoadingAction}
          >
            {isLoadingAction ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isJoined ? 'Leaving...' : 'Joining...'}
              </>
            ) : (
              isJoined ? 'Leave Challenge' : 'Join Challenge'
            )}
          </Button>
        </div>
        {/* Join Challenge Confirmation Dialog */}
        <Dialog open={showJoinConfirmation} onOpenChange={setShowJoinConfirmation}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Join {challenge?.name}</DialogTitle>              <DialogDescription>
                Are you ready to commit to this challenge? Let&apos;s get started!
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p><strong>Duration:</strong> {challenge?.duration}</p>
              <p><strong>Difficulty:</strong> {challenge?.difficulty}</p>
              <p className="mt-4">By joining this challenge, you commit to completing the daily tasks and tracking your progress regularly.</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowJoinConfirmation(false)}>Cancel</Button>
              <Button onClick={confirmJoinChallenge}>Join Challenge</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
              </CardHeader>              <CardContent>
                <div className="space-y-6">                  {/* Timeline view of challenge days */}
                  <div className="space-y-4">
                    <ChallengeDaysTimeline days={challenge.days} challengeId={params.id} />
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
