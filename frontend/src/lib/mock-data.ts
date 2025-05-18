// Mock data for FitTrack Pro application
// This will be replaced with real API calls in Phase 3

// Routine data
export const routines = [
  {
    id: 1,
    name: "Full Body Strength",
    description: "A comprehensive strength routine targeting all major muscle groups",
    frequency: "3x per week",
    duration: "45 minutes",
    level: "Intermediate",
    category: "Strength",
    exercises: [
      { name: "Squats", sets: 4, reps: "8-10", rest: "60 sec" },
      { name: "Bench Press", sets: 4, reps: "8-10", rest: "60 sec" },
      { name: "Deadlifts", sets: 3, reps: "8-10", rest: "90 sec" },
      { name: "Shoulder Press", sets: 3, reps: "10-12", rest: "60 sec" },
      { name: "Pull-ups", sets: 3, reps: "8-10", rest: "60 sec" },
    ],
    history: [
      { 
        date: "2023-08-15", 
        duration: "48 minutes", 
        exercises: [
          { name: "Squats", completed: true, weight: "185 lbs", actualSets: 4, actualReps: "8, 10, 8, 8" },
          { name: "Bench Press", completed: true, weight: "135 lbs", actualSets: 4, actualReps: "10, 10, 8, 8" },
          { name: "Deadlifts", completed: true, weight: "225 lbs", actualSets: 3, actualReps: "8, 8, 7" },
          { name: "Shoulder Press", completed: true, weight: "65 lbs", actualSets: 3, actualReps: "12, 10, 10" },
          { name: "Pull-ups", completed: true, weight: "bodyweight", actualSets: 3, actualReps: "8, 6, 5" }
        ]
      },
      { 
        date: "2023-08-12", 
        duration: "45 minutes", 
        exercises: [
          { name: "Squats", completed: true, weight: "175 lbs", actualSets: 4, actualReps: "10, 10, 9, 8" },
          { name: "Bench Press", completed: true, weight: "135 lbs", actualSets: 4, actualReps: "9, 8, 8, 7" },
          { name: "Deadlifts", completed: true, weight: "215 lbs", actualSets: 3, actualReps: "10, 8, 8" },
          { name: "Shoulder Press", completed: true, weight: "60 lbs", actualSets: 3, actualReps: "12, 12, 10" },
          { name: "Pull-ups", completed: true, weight: "bodyweight", actualSets: 3, actualReps: "7, 6, 5" }
        ]
      }
    ]
  },
  {
    id: 2,
    name: "HIIT Cardio Blast",
    description: "High-intensity interval training for maximum calorie burn",
    frequency: "2-3x per week",
    duration: "30 minutes",
    level: "All Levels",
    category: "Cardio",
    exercises: [
      { name: "Jumping Jacks", sets: 1, reps: "30 sec", rest: "10 sec" },
      { name: "Burpees", sets: 1, reps: "30 sec", rest: "10 sec" },
      { name: "Mountain Climbers", sets: 1, reps: "30 sec", rest: "10 sec" },
      { name: "High Knees", sets: 1, reps: "30 sec", rest: "10 sec" },
      { name: "Plank Jacks", sets: 1, reps: "30 sec", rest: "30 sec" },
    ],
    history: [] // No workout history yet
  },
  {
    id: 3,
    name: "Upper Body Focus",
    description: "Build strength and definition in your upper body",
    frequency: "2x per week",
    duration: "40 minutes",
    level: "Beginner",
    category: "Strength",
    exercises: [
      { name: "Push-ups", sets: 3, reps: "10-12", rest: "45 sec" },
      { name: "Dumbbell Rows", sets: 3, reps: "10-12", rest: "45 sec" },
      { name: "Lateral Raises", sets: 3, reps: "12-15", rest: "30 sec" },
      { name: "Bicep Curls", sets: 3, reps: "12-15", rest: "30 sec" },
      { name: "Tricep Dips", sets: 3, reps: "12-15", rest: "30 sec" },
    ],
    history: [
      { 
        date: "2023-08-14", 
        duration: "42 minutes", 
        exercises: [
          { name: "Push-ups", completed: true, weight: "bodyweight", actualSets: 3, actualReps: "12, 10, 10" },
          { name: "Dumbbell Rows", completed: true, weight: "35 lbs", actualSets: 3, actualReps: "12, 12, 10" },
          { name: "Lateral Raises", completed: true, weight: "15 lbs", actualSets: 3, actualReps: "15, 15, 12" },
          { name: "Bicep Curls", completed: true, weight: "25 lbs", actualSets: 3, actualReps: "15, 13, 12" },
          { name: "Tricep Dips", completed: true, weight: "bodyweight", actualSets: 3, actualReps: "15, 13, 10" }
        ]
      }
    ]
  },
  {
    id: 4,
    name: "Core Crusher",
    description: "Strengthen your core with this targeted abs workout",
    frequency: "3x per week",
    duration: "20 minutes",
    level: "All Levels",
    category: "Core",
    exercises: [
      { name: "Plank", sets: 3, reps: "30-60 sec", rest: "30 sec" },
      { name: "Russian Twists", sets: 3, reps: "20 reps", rest: "30 sec" },
      { name: "Mountain Climbers", sets: 3, reps: "30 sec", rest: "30 sec" },
      { name: "Leg Raises", sets: 3, reps: "12-15", rest: "30 sec" },
      { name: "Ab Rollouts", sets: 3, reps: "10-12", rest: "45 sec" },
    ],
    history: [] // No workout history yet
  },
];

// Challenge data
export const challenges = [
  {
    id: 1,
    name: "30-Day Push-Up Challenge",
    description: "Increase your upper body strength with progressively more push-ups each day",
    duration: "30 days",
    difficulty: "Intermediate",
    participants: 1245,
    startDate: "2023-08-01",
    endDate: "2023-08-30",
    progress: 65, // Percent complete
    days: [
      { day: 1, target: "10 push-ups", completed: true },
      { day: 2, target: "12 push-ups", completed: true },
      { day: 3, target: "14 push-ups", completed: true },
      // Additional days would be defined here
    ],
    image: "/images/challenges/pushup-challenge.png"
  },
  {
    id: 2,
    name: "10K Steps Daily",
    description: "Walk at least 10,000 steps every day for improved cardiovascular health",
    duration: "21 days",
    difficulty: "Beginner",
    participants: 3752,
    startDate: "2023-08-10",
    endDate: "2023-08-31",
    progress: 45, // Percent complete
    days: [
      { day: 1, target: "10,000 steps", completed: true },
      { day: 2, target: "10,000 steps", completed: true },
      // Additional days would be defined here
    ],
    image: "/images/challenges/steps-challenge.png"
  },
  {
    id: 3,
    name: "Squat Master Challenge",
    description: "Master the perfect squat form and build lower body strength",
    duration: "14 days",
    difficulty: "All Levels",
    participants: 852,
    startDate: "2023-08-15",
    endDate: "2023-08-29",
    progress: 30, // Percent complete
    days: [
      { day: 1, target: "20 squats", completed: true },
      { day: 2, target: "25 squats", completed: true },
      // Additional days would be defined here
    ],
    image: "/images/challenges/squat-challenge.png"
  },
  {
    id: 4,
    name: "Flexibility Journey",
    description: "Improve your flexibility with daily stretching routines",
    duration: "28 days",
    difficulty: "Beginner",
    participants: 621,
    startDate: "2023-08-05",
    endDate: "2023-09-02",
    progress: 50, // Percent complete
    days: [
      { day: 1, target: "10-minute stretch routine", completed: true },
      { day: 2, target: "12-minute stretch routine", completed: true },
      // Additional days would be defined here
    ],
    image: "/images/challenges/flexibility-challenge.png"
  },
];

// Social posts data
export const socialPosts = [
  {
    id: 1,
    user: {
      id: 101,
      name: "Jordan Smith",
      username: "jsmith_fitness",
      avatar: "/images/avatars/jordan.jpg"
    },
    content: "Just completed my 100th workout with FitTrack Pro! Really seeing progress in my chest and shoulders. Consistency is key! 💪",
    image: "/images/social/workout-completion.png",
    likes: 42,
    comments: [
      {
        id: 1001,
        user: {
          id: 102,
          name: "Alex Johnson",
          username: "alexfit",
          avatar: "/images/avatars/alex.jpg"
        },
        content: "That's amazing progress! Keep it up!",
        timestamp: "2023-08-15T14:30:00Z"
      },
      {
        id: 1002,
        user: {
          id: 103,
          name: "Sam Williams",
          username: "samw",
          avatar: "/images/avatars/sam.jpg"
        },
        content: "What routine are you following?",
        timestamp: "2023-08-15T14:45:00Z"
      }
    ],
    timestamp: "2023-08-15T14:00:00Z"
  },
  {
    id: 2,
    user: {
      id: 104,
      name: "Taylor Reed",
      username: "treed_fit",
      avatar: "/images/avatars/taylor.jpg"
    },
    content: "New personal best on deadlifts today! 265 lbs x 5 reps. So happy with my progress this month. Thanks to everyone in the community for the tips and encouragement!",
    image: "/images/social/deadlift-pr.png",
    likes: 78,
    comments: [
      {
        id: 2001,
        user: {
          id: 105,
          name: "Morgan Chen",
          username: "morganc",
          avatar: "/images/avatars/morgan.jpg"
        },
        content: "That's impressive! What's your target?",
        timestamp: "2023-08-14T10:22:00Z"
      }
    ],
    timestamp: "2023-08-14T10:15:00Z"
  },
  {
    id: 3,
    user: {
      id: 106,
      name: "Casey Jordan",
      username: "cj_fitness",
      avatar: "/images/avatars/casey.jpg"
    },
    content: "Just joined the 30-Day Push-Up Challenge! Who else is in? Let's motivate each other!",
    likes: 23,
    comments: [],
    timestamp: "2023-08-13T16:45:00Z"
  }
];
