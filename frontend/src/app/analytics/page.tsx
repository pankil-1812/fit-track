"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  BarChart, Activity, TrendingUp, Calendar, Dumbbell, 
  Clock, BarChart2, Heart, CalendarClock, ArrowUpRight, Circle
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

// Mock chart data
const workoutFrequencyData = [4, 5, 3, 4, 6, 5, 4]
const muscleGroupData = [
  { name: "Chest", percentage: 25 },
  { name: "Back", percentage: 20 },
  { name: "Legs", percentage: 20 },
  { name: "Shoulders", percentage: 15 },
  { name: "Arms", percentage: 15 },
  { name: "Core", percentage: 5 },
]
const performanceData = [
  { exercise: "Bench Press", values: [135, 145, 145, 155, 155, 160] },
  { exercise: "Squat", values: [185, 195, 205, 215, 225, 230] },
  { exercise: "Deadlift", values: [225, 245, 255, 255, 275, 285] },
]

// Placeholder barchart component
function SimpleBarChart({ data, label }: { data: number[], label?: string }) {
  const maxValue = Math.max(...data)
  
  return (
    <div className="w-full">
      <div className="flex items-end h-36 gap-1">
        {data.map((value, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div 
              className="w-full bg-primary rounded-t"
              style={{ height: `${(value / maxValue) * 100}%` }}
            ></div>
            <span className="text-xs text-muted-foreground">{`D${i + 1}`}</span>
          </div>
        ))}
      </div>
      {label && <p className="text-xs text-center mt-2 text-muted-foreground">{label}</p>}
    </div>
  )
}

// Placeholder progress chart
function ProgressChart({ data }: { data: any[] }) {
  return (
    <div className="space-y-4">
      {data.map((item, i) => (
        <div key={i} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>{item.exercise}</span>
            <span className="text-muted-foreground">
              {item.values[0]} → {item.values[item.values.length - 1]} lbs
              <span className="text-primary ml-1">
                (+{item.values[item.values.length - 1] - item.values[0]})
              </span>
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full" 
              style={{ width: `${(item.values[item.values.length - 1] / 300) * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState("week")
  
  return (
    <div className="container py-8 max-w-7xl">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Fitness Analytics</h1>
          <p className="text-muted-foreground">
            Track your progress and visualize your fitness journey
          </p>
        </div>
        
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="calories">Calories</TabsTrigger>
              <TabsTrigger value="time">Time</TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              <div className="flex justify-end mb-4">
                <div className="inline-flex items-center rounded-lg border p-1 text-muted-foreground">
                  <Button
                    variant={timeframe === "week" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setTimeframe("week")}
                  >
                    Week
                  </Button>
                  <Button
                    variant={timeframe === "month" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setTimeframe("month")}
                  >
                    Month
                  </Button>
                  <Button
                    variant={timeframe === "year" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setTimeframe("year")}
                  >
                    Year
                  </Button>
                </div>
              </div>
              
              <TabsContent value="overview" className="mt-0 space-y-6">
                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                      <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
                      <Dumbbell className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">24</div>
                      <p className="text-xs text-muted-foreground flex items-center mt-1">
                        <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                        <span className="text-green-500 font-medium">+8%</span> from last {timeframe}
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                      <CardTitle className="text-sm font-medium">Workout Time</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">14.5 hrs</div>
                      <p className="text-xs text-muted-foreground flex items-center mt-1">
                        <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                        <span className="text-green-500 font-medium">+12%</span> from last {timeframe}
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                      <CardTitle className="text-sm font-medium">Calories Burned</CardTitle>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">8,240</div>
                      <p className="text-xs text-muted-foreground flex items-center mt-1">
                        <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                        <span className="text-green-500 font-medium">+5%</span> from last {timeframe}
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                      <CardTitle className="text-sm font-medium">Strength Gain</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">+9.2%</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Average across major lifts
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Workout Frequency Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Workout Frequency</CardTitle>
                    <CardDescription>
                      Your workout activity over the past {timeframe}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SimpleBarChart 
                      data={workoutFrequencyData} 
                      label={timeframe === "week" ? "Last 7 days" : timeframe === "month" ? "Last 4 weeks" : "Last 12 months"} 
                    />
                  </CardContent>
                </Card>
                
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Muscle Group Focus */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Muscle Group Focus</CardTitle>
                      <CardDescription>
                        Distribution of your training across muscle groups
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {muscleGroupData.map((item) => (
                          <div key={item.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Circle className="h-3 w-3 fill-primary text-primary" />
                              <span>{item.name}</span>
                            </div>
                            <span>{item.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Recent Personal Records */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recent PRs</CardTitle>
                      <CardDescription>
                        Your latest personal records
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Bench Press</p>
                            <p className="text-xs text-muted-foreground">May 12, 2025</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">160 lbs</p>
                            <p className="text-xs text-green-500">+15 lbs</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Squat</p>
                            <p className="text-xs text-muted-foreground">May 8, 2025</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">230 lbs</p>
                            <p className="text-xs text-green-500">+20 lbs</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Deadlift</p>
                            <p className="text-xs text-muted-foreground">May 15, 2025</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">285 lbs</p>
                            <p className="text-xs text-green-500">+25 lbs</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" className="w-full" size="sm">View All Records</Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="progress" className="mt-0 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Strength Progress</CardTitle>
                    <CardDescription>
                      Your progression on main compound lifts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProgressChart data={performanceData} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="calories">
                <div className="py-8 text-center text-muted-foreground">
                  Detailed calories analytics will be implemented in the next phase.
                </div>
              </TabsContent>
              
              <TabsContent value="time">
                <div className="py-8 text-center text-muted-foreground">
                  Detailed time analytics will be implemented in the next phase.
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
