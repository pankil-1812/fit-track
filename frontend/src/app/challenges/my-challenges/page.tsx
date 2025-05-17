"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { 
  ArrowLeft, 
  Search, 
  Calendar, 
  Trophy, 
  Clock, 
  CheckCircle,
  ClockIcon,
  HistoryIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

// Import custom data hooks
import { useUserChallenges } from "@/lib/data-hooks"

export default function MyChallengesPage() {
  const { userChallenges, status, error } = useUserChallenges()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("active")
  
  const { active: activeChallenges, completed: completedChallenges, past: pastChallenges } = userChallenges
  
  // Filter challenges based on search and active tab
  const getFilteredChallenges = (challengeList: any[]) => {
    return challengeList.filter(challenge => 
      challenge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  return (
    <div className="container py-8 max-w-7xl">
      <div className="flex flex-col space-y-6">
        {/* Back navigation */}
        <div>
          <Button variant="ghost" className="pl-0" asChild>
            <Link href="/challenges">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Challenges
            </Link>
          </Button>
        </div>
        
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">My Challenges</h1>
          <p className="text-muted-foreground">
            Track and manage your active and completed fitness challenges
          </p>
        </div>
        
        {/* Search section */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search my challenges..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Challenge Status Tabs */}
        <Tabs defaultValue="active" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          
          {/* Active Challenges Tab */}
          <TabsContent value="active" className="mt-0">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {getFilteredChallenges(activeChallenges).length > 0 ? (
                getFilteredChallenges(activeChallenges).map((challenge) => (
                  <ActiveChallengeCard key={challenge.id} challenge={challenge} />
                ))
              ) : (
                <div className="col-span-3 flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted p-3 mb-4">
                    <Trophy className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">No active challenges</h3>
                  <p className="text-muted-foreground mt-1 mb-4">
                    {searchQuery ? 
                      "We couldn't find any active challenges matching your search." : 
                      "You don't have any active challenges. Join a challenge to get started!"}
                  </p>
                  <Button asChild>
                    <Link href="/challenges">Browse Challenges</Link>
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Completed Challenges Tab */}
          <TabsContent value="completed" className="mt-0">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {getFilteredChallenges(completedChallenges).length > 0 ? (
                getFilteredChallenges(completedChallenges).map((challenge) => (
                  <CompletedChallengeCard key={challenge.id} challenge={challenge} />
                ))
              ) : (
                <div className="col-span-3 flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted p-3 mb-4">
                    <CheckCircle className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">No completed challenges</h3>
                  <p className="text-muted-foreground mt-1 mb-4">
                    You haven't completed any challenges yet. Keep working on your active challenges!
                  </p>
                  <Button variant="outline" asChild>
                    <Link href="/challenges">View Active Challenges</Link>
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Past Challenges Tab */}
          <TabsContent value="past" className="mt-0">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {getFilteredChallenges(pastChallenges).length > 0 ? (
                getFilteredChallenges(pastChallenges).map((challenge) => (
                  <PastChallengeCard key={challenge.id} challenge={challenge} />
                ))
              ) : (
                <div className="col-span-3 flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted p-3 mb-4">
                    <HistoryIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">No past challenges</h3>
                  <p className="text-muted-foreground mt-1 mb-4">
                    You don't have any expired or abandoned challenges.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Challenge Stats Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">My Challenge Stats</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Challenges Joined</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{activeChallenges.length + completedChallenges.length + pastChallenges.length}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Challenges Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{completedChallenges.length}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {completedChallenges.length > 0 ? 
                    `${Math.round((completedChallenges.length / (completedChallenges.length + pastChallenges.length)) * 100)}%` : 
                    '0%'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Points Earned</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">1,250</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function ActiveChallengeCard({ challenge }: { challenge: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full flex flex-col overflow-hidden">
        <div className="relative h-40">
          {challenge.image ? (
            <Image 
              src={challenge.image}
              fill
              alt={challenge.name}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <Trophy className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg line-clamp-1">{challenge.name}</CardTitle>
          <CardDescription className="line-clamp-2">
            {challenge.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4 flex-grow">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{challenge.progress}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary" 
                style={{ width: `${challenge.progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{challenge.endDate}</span>
              </div>
              <span className="font-medium">
                {challenge.days.filter((day: any) => day.completed).length} / {challenge.days.length} days
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" asChild>
            <Link href={`/challenges/${challenge.id}`}>
              Continue Challenge
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

function CompletedChallengeCard({ challenge }: { challenge: any }) {
  // For mockup, we'll pretend this challenge is completed
  const completedDate = "Aug 30, 2023"
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full flex flex-col overflow-hidden">
        <div className="relative h-40">
          {challenge.image ? (
            <>
              <Image 
                src={challenge.image}
                fill
                alt={challenge.name}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {/* Overlay with completion badge */}
              <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                <div className="bg-primary text-primary-foreground rounded-full p-4">
                  <CheckCircle className="h-10 w-10" />
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <Trophy className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg line-clamp-1">{challenge.name}</CardTitle>
            <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-xs rounded-full px-2 py-1">
              Completed
            </span>
          </div>
          <CardDescription className="line-clamp-2">
            {challenge.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4 flex-grow">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">100%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary w-full"></div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span>Completed on {completedDate}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button variant="outline" className="w-full" asChild>
            <Link href={`/challenges/${challenge.id}`}>
              View Details
            </Link>
          </Button>
          <Button className="w-full">Share</Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

function PastChallengeCard({ challenge }: { challenge: any }) {
  // For mockup, we'll pretend this challenge is expired
  const expiredDate = "Jul 15, 2023"
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full flex flex-col overflow-hidden grayscale">
        <div className="relative h-40">
          {challenge.image ? (
            <Image 
              src={challenge.image}
              fill
              alt={challenge.name}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <Trophy className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          {/* Overlay with expired badge */}
          <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
            <div className="bg-muted text-muted-foreground rounded-full p-4">
              <ClockIcon className="h-10 w-10" />
            </div>
          </div>
        </div>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg line-clamp-1">{challenge.name}</CardTitle>
            <span className="bg-muted text-muted-foreground text-xs rounded-full px-2 py-1">
              Expired
            </span>
          </div>
          <CardDescription className="line-clamp-2">
            {challenge.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4 flex-grow">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{challenge.progress}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-muted-foreground" 
                style={{ width: `${challenge.progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Expired on {expiredDate}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" asChild>
            <Link href={`/challenges/${challenge.id}`}>
              View Details
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
