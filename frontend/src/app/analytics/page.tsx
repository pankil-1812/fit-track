"use client"

import { useState, useEffect } from "react"
import { 
  Activity, TrendingUp, Dumbbell, 
  Clock, ArrowUpRight,
  Flame
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
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

// Define chart data types
interface WorkoutFrequencyData {
  name: string;
  workouts: number;
}

interface MuscleGroupData {
  name: string;
  percentage: number;
}

interface PerformanceData {
  exercise: string;
  values: number[];
  dates: string[];
}

interface CalorieData {
  date: string;
  calories: number;
}

// Color scheme for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// Dynamic data generation based on selected timeframe
const generateWorkoutData = (timeframe: string): WorkoutFrequencyData[] => {
  switch(timeframe) {
    case 'week':
      return [
        { name: 'Mon', workouts: 4 },
        { name: 'Tue', workouts: 5 },
        { name: 'Wed', workouts: 3 },
        { name: 'Thu', workouts: 4 },
        { name: 'Fri', workouts: 6 },
        { name: 'Sat', workouts: 5 },
        { name: 'Sun', workouts: 4 },
      ];
    case 'month':
      return Array.from({ length: 4 }, (_, i) => ({
        name: `Week ${i + 1}`,
        workouts: Math.floor(Math.random() * 15) + 10
      }));
    case 'year':
      return Array.from({ length: 12 }, (_, i) => {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return {
          name: monthNames[i],
          workouts: Math.floor(Math.random() * 20) + 15
        };
      });
    default:
      return [];
  }
};

// Muscle group data
const muscleGroupData: MuscleGroupData[] = [
  { name: "Chest", percentage: 25 },
  { name: "Back", percentage: 20 },
  { name: "Legs", percentage: 20 },
  { name: "Shoulders", percentage: 15 },
  { name: "Arms", percentage: 15 },
  { name: "Core", percentage: 5 },
];

// Performance data with dates
const generatePerformanceData = (): PerformanceData[] => {
  const getRandomDates = (count: number) => {
    const dates: string[] = [];
    const currentDate = new Date();
    
    for (let i = count - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(currentDate.getDate() - (i * 7)); // Weekly progression
      dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    
    return dates;
  };
  
  return [
    { 
      exercise: "Bench Press", 
      values: [135, 145, 145, 155, 155, 160],
      dates: getRandomDates(6)
    },
    { 
      exercise: "Squat", 
      values: [185, 195, 205, 215, 225, 230],
      dates: getRandomDates(6)
    },
    { 
      exercise: "Deadlift", 
      values: [225, 245, 255, 255, 275, 285],
      dates: getRandomDates(6)
    }
  ];
};

// Generate calorie burn data
const generateCalorieData = (timeframe: string): CalorieData[] => {
  const result: CalorieData[] = [];
  
  let days = timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 365;
  days = Math.min(days, 30); // Limit to 30 data points max
  
  const date = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const currentDate = new Date();
    currentDate.setDate(date.getDate() - i);
    
    result.push({
      date: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      calories: Math.floor(Math.random() * 300) + 200
    });
  }
  
  return result;
};

// Custom muscle group pie chart
function MuscleGroupChart({ data }: { data: MuscleGroupData[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          dataKey="percentage"
          nameKey="name"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value}%`} />
      </PieChart>
    </ResponsiveContainer>
  );
}

// Calorie burn area chart
function CalorieBurnChart({ data }: { data: CalorieData[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip formatter={(value) => [`${value} calories`, 'Burned']} />
        <Area type="monotone" dataKey="calories" stroke="#FFA500" fill="#FFA50066" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// Simple bar chart implementation
function SimpleBarChart({ data, label }: { data: WorkoutFrequencyData[], label: string }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => [`${value} workouts`, 'Frequency']} />
        <Bar dataKey="workouts" fill="#8884d8" radius={[4, 4, 0, 0]} />
        {label && <text x={0} y={15} textAnchor="start" dominantBaseline="hanging" className="text-xs text-muted-foreground">{label}</text>}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

// Progress chart implementation
function ProgressChart({ data }: { data: PerformanceData[] }) {
  return (
    <div>
      {data.map((exercise, index) => (
        <div key={index} className="mb-8">
          <h4 className="text-sm font-medium mb-2">{exercise.exercise}</h4>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">
              {exercise.values[0]} → {exercise.values[exercise.values.length - 1]} lbs
            </span>
            <span className="text-primary">
              (+{exercise.values[exercise.values.length - 1] - exercise.values[0]} lbs)
            </span>
          </div>
          <ResponsiveContainer width="100%" height={100}>
            <LineChart
              data={exercise.values.map((value, i) => ({
                date: exercise.dates[i],
                weight: value,
              }))}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
              <Tooltip formatter={(value) => [`${value} lbs`, 'Weight']} />
              <Line type="monotone" dataKey="weight" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
}

// Time spent chart implementation
function TimeSpentChart({ data }: { data: { date: string; minutes: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip formatter={(value) => [`${value} minutes`, 'Time Spent']} />
        <Line type="monotone" dataKey="minutes" stroke="#82ca9d" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState("week");
  
  // Initialize workout frequency data based on timeframe
  const workoutFrequencyData = generateWorkoutData(timeframe);
  
  // Initialize performance data
  const performanceData = generatePerformanceData();
  
  // Initialize calorie data
  const calorieData = generateCalorieData(timeframe);
  
  // Initialize time data
  const timeData = Array.from({ length: timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 12 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (timeframe === 'week' ? i : i * (timeframe === 'month' ? 1 : 30)));
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      minutes: Math.floor(Math.random() * 60) + 30
    };
  }).reverse();
  
  // Update data when timeframe changes
  useEffect(() => {
    // This would usually fetch data from an API based on the timeframe
    // For now, we're just using the mock data generators
  }, [timeframe]);
  
  return (
    <div className="container mx-auto py-8 max-w-7xl">
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
                
                <div className="grid gap-4 md:grid-cols-2">                  {/* Muscle Group Focus */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Muscle Group Focus</CardTitle>
                      <CardDescription>
                        Distribution of your training across muscle groups
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <MuscleGroupChart data={muscleGroupData} />
                      <div className="mt-4 space-y-2">
                        {muscleGroupData.map((item, index) => (
                          <div key={item.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
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
                <TabsContent value="calories" className="mt-0 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Calorie Burn</CardTitle>
                    <CardDescription>
                      Your calorie expenditure over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CalorieBurnChart data={calorieData} />
                  </CardContent>
                </Card>
                
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Weekly calorie summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Weekly Summary</CardTitle>
                      <CardDescription>
                        Calorie burn for current week
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Flame className="h-4 w-4 text-orange-500" />
                            <span>Total Calories</span>
                          </div>
                          <span className="font-bold">8,240 kcal</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-green-500" />
                            <span>Daily Average</span>
                          </div>
                          <span className="font-bold">1,177 kcal</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-blue-500" />
                            <span>Weekly Goal</span>
                          </div>
                          <span className="font-bold">7,500 kcal</span>
                        </div>
                      </div>
                        <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-muted-foreground">You&apos;ve exceeded your weekly goal by 740 kcal</p>
                        <div className="w-full bg-muted rounded-full h-2.5 mt-2">
                          <div className="bg-primary h-2.5 rounded-full" style={{ width: "110%" }}></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Calorie breakdown */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Workout Type Breakdown</CardTitle>
                      <CardDescription>
                        Calories burned by workout type
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                            <span>Strength Training</span>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">3,840 kcal</p>
                            <p className="text-xs text-muted-foreground">46.6%</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                            <span>Cardio</span>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">2,460 kcal</p>
                            <p className="text-xs text-muted-foreground">29.9%</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                            <span>HIIT</span>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">1,940 kcal</p>
                            <p className="text-xs text-muted-foreground">23.5%</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="time" className="mt-0 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Workout Duration</CardTitle>
                    <CardDescription>
                      Your time spent working out over the {timeframe}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TimeSpentChart data={timeData} />
                  </CardContent>
                </Card>
                
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Time efficiency */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Time Efficiency</CardTitle>
                      <CardDescription>
                        Optimize your workout time
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Actual workout time</span>
                            <span className="text-sm font-medium">80%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '80%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Rest time</span>
                            <span className="text-sm font-medium">15%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '15%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Setup time</span>
                            <span className="text-sm font-medium">5%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '5%' }}></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm">Average workout duration: <span className="font-bold">54 minutes</span></p>
                        <p className="text-sm text-muted-foreground mt-1">Your time efficiency has improved by 8% compared to last {timeframe}.</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Time by exercise type */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Time by Exercise Type</CardTitle>
                      <CardDescription>
                        How you distribute your workout time
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                            <span>Compound Lifts</span>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">6.5 hours</p>
                            <p className="text-xs text-muted-foreground">45%</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                            <span>Isolation Exercises</span>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">4.3 hours</p>
                            <p className="text-xs text-muted-foreground">30%</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                            <span>Cardio</span>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">2.9 hours</p>
                            <p className="text-xs text-muted-foreground">20%</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                            <span>Flexibility</span>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">0.7 hours</p>
                            <p className="text-xs text-muted-foreground">5%</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
