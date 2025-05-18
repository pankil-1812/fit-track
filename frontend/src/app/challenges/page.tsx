"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Search, Filter, Users, Trophy, Calendar, ArrowRight, Plus } from "lucide-react"
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

// Import custom data hooks for API integration
import { useChallenges } from "@/lib/data-hooks"

export default function ChallengesPage() {
    const { challenges, status, error } = useChallenges()
    const [searchQuery, setSearchQuery] = useState("")
    const [activeTab, setActiveTab] = useState("all")

    // Filter challenges based on search and active tab
    const filteredChallenges = challenges.filter(challenge => {
        // Filter by search query
        const matchesSearch = challenge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            challenge.description.toLowerCase().includes(searchQuery.toLowerCase())

        // Filter by tab (difficulty)
        const matchesTab = activeTab === "all" ||
            challenge.difficulty.toLowerCase() === activeTab.toLowerCase()

        return matchesSearch && matchesTab
    })

    return (
        <div className="container mx-auto py-8 max-w-7xl">
            <div className="flex flex-col space-y-6">
                <div className="flex flex-col space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Fitness Challenges</h1>
                    <p className="text-muted-foreground">
                        Join community challenges to stay motivated and track your progress
                    </p>
                </div>

                {/* Search and filter section */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search challenges..."
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
                                <DropdownMenuItem>All Challenges</DropdownMenuItem>
                                <DropdownMenuItem>Most Popular</DropdownMenuItem>
                                <DropdownMenuItem>Recently Added</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>Duration</DropdownMenuLabel>
                                <DropdownMenuItem>7 Days</DropdownMenuItem>
                                <DropdownMenuItem>14 Days</DropdownMenuItem>
                                <DropdownMenuItem>30 Days</DropdownMenuItem>
                                <DropdownMenuItem>90 Days</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Create Challenge
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>Create New Challenge</DialogTitle>
                                    <DialogDescription>
                                        Create a custom challenge to share with the community
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Challenge Name</label>
                                        <Input placeholder="e.g., 21-Day Meditation Challenge" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Description</label>
                                        <Input placeholder="Describe your challenge..." />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Duration (Days)</label>
                                            <Input type="number" placeholder="30" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Difficulty</label>
                                            <select className="w-full h-10 px-3 py-2 border rounded-md border-input bg-transparent text-sm">
                                                <option>Beginner</option>
                                                <option>Intermediate</option>
                                                <option>Advanced</option>
                                                <option>All Levels</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Challenge Image</label>
                                        <Input type="file" />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline">Cancel</Button>
                                    <Button>Create Challenge</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Tabs for filtering by difficulty */}
                <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                    <TabsList className="mb-6">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="beginner">Beginner</TabsTrigger>
                        <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
                        <TabsTrigger value="advanced">Advanced</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="mt-0">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredChallenges.length > 0 ? (
                                filteredChallenges.map((challenge) => (
                                    <ChallengeCard key={challenge.id} challenge={challenge} />
                                ))
                            ) : (
                                <div className="col-span-3 flex flex-col items-center justify-center py-12 text-center">
                                    <div className="rounded-full bg-muted p-3 mb-4">
                                        <Search className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-medium">No challenges found</h3>
                                    <p className="text-muted-foreground mt-1 mb-4">
                                        We could not find any challenges matching your search.
                                    </p>
                                    <Button variant="outline" onClick={() => setSearchQuery("")}>Clear Search</Button>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* Additional tabs would have the same structure but filtered content */}
                    <TabsContent value="beginner" className="mt-0">
                        {/* Same structure as all tab */}
                    </TabsContent>
                    <TabsContent value="intermediate" className="mt-0">
                        {/* Same structure as all tab */}
                    </TabsContent>
                    <TabsContent value="advanced" className="mt-0">
                        {/* Same structure as all tab */}
                    </TabsContent>
                </Tabs>

                {/* My Challenges section */}
                <div className="mt-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">My Active Challenges</h2>
                        <Button variant="outline" className="gap-2" asChild>
                            <Link href="/challenges/my-challenges">
                                View All My Challenges
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredChallenges.slice(0, 3).map((challenge) => (
                            <MyChallengeCard key={challenge.id} challenge={challenge} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

// Challenge card component
function ChallengeCard({ challenge }: { challenge: any }) {
    const [isJoined, setIsJoined] = useState(false)

    // Check if user is already participating in this challenge
    useEffect(() => {
        // This would typically come from the API response
        // For now we're using localStorage to persist the joined state
        const joinedChallenges = localStorage.getItem('joinedChallenges')
        if (joinedChallenges) {
            const challenges = JSON.parse(joinedChallenges)
            setIsJoined(challenges.includes(challenge.id))
        }
    }, [challenge.id])

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="h-full flex flex-col overflow-hidden">
                <div className="relative h-48">
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

                    {/* Show a badge for joined challenges */}
                    {isJoined && (
                        <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 text-xs font-medium rounded-md">
                            Joined
                        </div>
                    )}
                </div>
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{challenge.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                        {challenge.description}
                    </CardDescription>
                </CardHeader>
                <CardContent className="pb-2 flex-grow">
                    <div className="flex flex-wrap gap-2 text-xs mb-3">
                        <div className="px-2 py-1 bg-primary/10 text-primary rounded-md">
                            {challenge.difficulty}
                        </div>
                        <div className="px-2 py-1 bg-muted rounded-md flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{challenge.duration}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{challenge.participants} participants</span>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full"
                        variant={isJoined ? "outline" : "default"}
                        asChild
                    >
                        <Link href={`/challenges/${challenge.id}`}>
                            {isJoined ? 'Continue Challenge' : 'Join Challenge'}
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    )
}

// My Challenge card component
function MyChallengeCard({ challenge }: { challenge: any }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="h-full flex flex-col">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{challenge.name}</CardTitle>
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
                    <Button variant="outline" className="w-full" asChild>
                        <Link href={`/challenges/${challenge.id}`}>
                            Continue Challenge
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    )
}
